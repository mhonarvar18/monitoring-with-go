package services

import (
	"crypto/sha256"
	"encoding/hex"
	"fmt"
	"log"
	"math/rand"
	"net"
	"strings"
	"time"

	"monitoring-with-go/database"
	"monitoring-with-go/models"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

// StartUdpListener starts listening for UDP messages asynchronously
type UdpMessage struct {
	Payload []byte
	IP      string
}

// تعداد workerها
const workerCount = 32
const channelBufferSize = 10000

func StartUdpListener() error {
	addr := "localhost:49152"
	udpAddr, err := net.ResolveUDPAddr("udp", addr)
	if err != nil {
		return fmt.Errorf("failed to resolve UDP address: %v", err)
	}

	conn, err := net.ListenUDP("udp", udpAddr)
	if err != nil {
		return fmt.Errorf("failed to listen on UDP port: %v", err)
	}
	defer conn.Close()

	log.Printf("Listening for UDP messages on %s...\n", addr)

	// کانال برای پیام‌ها
	msgChan := make(chan UdpMessage, channelBufferSize)

	// Workerها
	for i := 0; i < workerCount; i++ {
		go udpWorker(msgChan)
	}

	buffer := make([]byte, 2048)

	for {
		n, addr, err := conn.ReadFromUDP(buffer)
		if err != nil {
			log.Println("Error reading UDP message:", err)
			continue
		}

		msg := make([]byte, n)
		copy(msg, buffer[:n])

		// ارسال به کانال
		msgChan <- UdpMessage{
			Payload: msg,
			IP:      addr.String(),
		}
	}
}

func udpWorker(msgChan <-chan UdpMessage) {
	for msg := range msgChan {
		if err := processUdpData(msg.Payload, msg.IP); err != nil {
			log.Printf("Error processing UDP message: %v", err)
		} else {
			log.Println("Message processed successfully")
		}
	}
}

// processUdpData processes the UDP payload and saves it to the database
func processUdpData(payload []byte, ip string) error {
	timestamp := time.Now().Format("20060102150405.0000")
	timestamp = strings.ReplaceAll(timestamp, ".", "")
	message := string(payload)
	extendedMessage := fmt.Sprintf("%s&&&%s&&&%s", message, ip, timestamp)
	log.Println("************************************")
	log.Println("Extended Message:", extendedMessage)
	log.Println("************************************")

	parts := strings.Split(extendedMessage, "&&&")
	if len(parts) < 2 {
		return fmt.Errorf("invalid message format")
	}

	eventData := parts[0]
	eventFields := strings.Split(eventData, ";")
	if len(eventFields) < 12 {
		return fmt.Errorf("invalid event data format")
	}

	// Example extraction (adjust based on your message format)
	year, month, day := eventFields[0], eventFields[1], eventFields[2]
	hour, minute := eventFields[3], eventFields[4]
	panelCode := eventFields[7]
	
	dedupHash := BuildDedupHash(eventData, timestamp, ip, ";")
	randomNumber := rand.Intn(901) + 100

	eventMap := map[string]interface{}{
		"id":                  uuid.New().String(),
		"originalZoneId":      uuid.New().String(),
		"originalPartitionId": uuid.New().String(),
		"referenceId":         uuid.New().String(),
		"time":                fmt.Sprintf("%s:%s", hour, minute),
		"date":                fmt.Sprintf("%s-%s-%s", year, month, day),
		"originalEmployeeId":  uuid.New().String(),
		"originalBranchCode":  panelCode,
		"ip":                  ip,
		"description":         "description",
		"confirmationStatus":  "Unconfirmed",
		"createdAt":           time.Now(),
		"alarmId":             uuid.New().String(),
		"branchId":            uuid.New().String(),
		"zoneId":              uuid.New().String(),
		"partitionId":         uuid.New().String(),
		"employeeId":          uuid.New().String(),
		"old_id":              randomNumber,
		"version":             0,
		"deletedAt":           nil,
		"dedupHash":           dedupHash,
	}

	return SaveEventToDatabase(eventMap)
}

// SaveEventToDatabase saves the event map into the DB asynchronously
func SaveEventToDatabase(data map[string]interface{}) error {
	return database.DB.Transaction(func(tx *gorm.DB) error {

		// var existing models.Event
		// if err := tx.Where("dedupHash = ?", getString(data["dedupHash"])).First(&existing).Error; err == nil {
		// 	log.Println("Duplicate event detected, skipping save:", data["dedupHash"])
		// 	return nil // duplicate found, skip
		// }

		event := models.Event{
			ID:                  getString(data["id"]),
			OriginalZoneID:      getString(data["originalZoneId"]),
			OriginalPartitionID: getString(data["originalPartitionId"]),
			ReferenceID:         getString(data["referenceId"]),
			Time:                getString(data["time"]),
			Date:                getString(data["date"]),
			OriginalEmployeeID:  getString(data["originalEmployeeId"]),
			OriginalBranchCode:  getString(data["originalBranchCode"]),
			IP:                  getString(data["ip"]),
			Description:         getString(data["description"]),
			ConfirmationStatus:  getString(data["confirmationStatus"]),
			CreatedAt:           getTime(data["createdAt"]),
			AlarmID:             getString(data["alarmId"]),
			BranchID:            getString(data["branchId"]),
			ZoneID:              getString(data["zoneId"]),
			PartitionID:         getString(data["partitionId"]),
			EmployeeID:          getString(data["employeeId"]),
			OldID:               getInt(data["old_id"]),
			Version:             getInt(data["version"]),
			DeletedAt:           gorm.DeletedAt{},
			DedupHash:           getString(data["dedupHash"]),
		}

		if err := tx.Create(&event).Error; err != nil {
			return fmt.Errorf("failed to save event: %w", err)
		}

		return nil
	})
}

// Helpers

func BuildDedupHash(message string, timestamp string, ip string, delimiter string) string {
	// حذف trailing ;
	canonRaw := strings.TrimRight(message, delimiter)

	// normalize IP
	ip = strings.TrimSpace(ip)
	if parsed := net.ParseIP(ip); parsed != nil {
		ip = parsed.String()
	}

	// v1| prefix
	dedupKey := canonRaw + "&&&" + ip + "&&&" + timestamp
	finalKey := "v1|" + dedupKey

	hash := sha256.Sum256([]byte(finalKey))
	return hex.EncodeToString(hash[:])
}

func getString(val interface{}) string {
	if val == nil {
		return ""
	}
	if s, ok := val.(string); ok {
		return s
	}
	return fmt.Sprintf("%v", val)
}

func getTime(val interface{}) time.Time {
	if val == nil {
		return time.Time{}
	}
	if t, ok := val.(time.Time); ok {
		return t
	}
	if s, ok := val.(string); ok {
		t, _ := time.Parse(time.RFC3339, s)
		return t
	}
	return time.Time{}
}

func getInt(val interface{}) int {
	if val == nil {
		return 0
	}
	switch v := val.(type) {
	case int:
		return v
	case int64:
		return int(v)
	case float64:
		return int(v)
	case string:
		var i int
		fmt.Sscanf(v, "%d", &i)
		return i
	default:
		return 0
	}
}
