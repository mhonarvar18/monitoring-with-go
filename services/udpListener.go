package services

import (
	"fmt"
	"log"
	"math/rand"
	"net"
	"strings"
	"time"

	"monitoring-with-go/database" // Import the database package

	"github.com/google/uuid" // For generating UUIDs
)

// StartUdpListener listens for incoming UDP messages and processes them
func StartUdpListener() error {
	// Listen on port 49152 (or any other port you prefer)
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

	// Buffer to hold incoming data
	buffer := make([]byte, 1024)

	for {
		// Read UDP data into the buffer
		n, addr, err := conn.ReadFromUDP(buffer)
		if err != nil {
			log.Println("Error reading UDP message:", err)
			continue
		}

		// Log received message
		log.Printf("Received message from %s: %s\n", addr, string(buffer[:n]))

		// Process and save the received data
		err = processUdpData(buffer[:n], addr.String())
		if err != nil {
			log.Println("Error processing message:", err)
		} else {
			log.Println("Message processed successfully")
		}
	}

	return nil
}

// processUdpData processes the received UDP data and adds additional information
func processUdpData(payload []byte, ip string) error {
	// Convert the payload to string
	message := string(payload)

	// Add the IP and timestamp to the message
	extendedMessage := fmt.Sprintf("%s&&&%s&&&%s", message, ip, fmt.Sprintf("%d", time.Now().Unix()))

	// Print out the extended message (this is what you will save to the DB)
	log.Println("Extended Message:", extendedMessage)

	// Split the message based on delimiter (assuming '&&&' in this case)
	parts := strings.Split(extendedMessage, "&&&")
	if len(parts) < 2 {
		log.Println("Invalid message format")
		return fmt.Errorf("invalid message format")
	}

	// Extract event data (first part of the message before the '&&&')
	eventData := parts[0]

	// Example: Process the extended message and extract data
	// Here you would parse and extract specific fields (you might already have them from your existing code)
	// For simplicity, we’ll assume you're extracting the necessary fields directly

	eventFields := strings.Split(eventData, ";")

	if len(eventFields) < 12 {
		log.Println("Error: Invalid data format")
		return fmt.Errorf("invalid data format")
	}

	// Extracting data from the message
	year := eventFields[0]
	month := eventFields[1]
	day := eventFields[2]
	hour := eventFields[3]
	minute := eventFields[4]
	// second := eventFields[5]
	// alarmCode := eventFields[6]
	panelCode := eventFields[7]
	// employeeId := eventFields[8]
	// zoneId := eventFields[9]
	// partitionId := eventFields[10]
	//description := eventFields[11]

	// Generate a unique deduplication hash
	dedupHash := fmt.Sprintf("%s-%s-%s", eventData, ip, time.Now().Format("20060102150405"))

	randomNumber := rand.Intn(901) + 100
	// Prepare data to save to the database
	eventDataMap := map[string]interface{}{
		"originalZoneId":      uuid.New().String(), // You can replace it with actual value
		"originalPartitionId": uuid.New().String(), // Replace with actual value
		"referenceId":         uuid.New().String(), // Replace with actual value
		"time":                fmt.Sprintf("%s:%s", hour, minute),
		"date":                fmt.Sprintf("%s-%s-%s", year, month, day),
		"originalEmployeeId":  uuid.New().String(), // Replace with actual value
		"originalBranchCode":  panelCode,
		"ip":                  ip,
		"description":         "description",
		"confirmationStatus":  "Unconfirmed", // Replace with actual status if needed
		"createdAt":           time.Now(),
		"alarmId":             uuid.New().String(), // Replace with actual value
		"branchId":            uuid.New().String(), // Replace with actual value
		"zoneId":              uuid.New().String(), // Replace with actual value
		"partitionId":         uuid.New().String(), // Replace with actual value
		"id":                  uuid.New().String(), // Unique ID for the event
		"old_id":              randomNumber,
		"version":             0,
		"deletedAt":           nil, // Assuming it's nullable
		//"employeeId":          employeeId,         // Replace with actual value
		"employeeId": uuid.New().String(), // Replace with actual value
		"dedupHash":  dedupHash,
	}

	// Save event to the database
	err := saveEventToDatabase(eventDataMap)
	if err != nil {
		log.Printf("Error saving event: %v", err)
		return err
	}

	// Optionally, you can publish to RabbitMQ
	// publishToRabbit([]byte(extendedMessage))

	return nil
}

func saveEventToDatabase(data map[string]interface{}) error {
	// Start a transaction
	tx, err := database.DB.Begin()
	if err != nil {
		log.Printf("Failed to begin transaction: %v", err)
		return fmt.Errorf("failed to begin transaction: %w", err)
	}

	// Insert the event data into the database (SQLite example)
	query := `
        INSERT INTO Event (
            id, originalZoneId, originalPartitionId, referenceId, time, date, 
            originalEmployeeId, originalBranchCode, ip, description, confirmationStatus, 
            createdAt, alarmId, branchId, zoneId, partitionId, employeeId, 
            old_id, version, deletedAt, dedupHash
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `

	// Prepare the values to be inserted
	values := []interface{}{
		data["id"], data["originalZoneId"], data["originalPartitionId"], data["referenceId"],
		data["time"], data["date"], data["originalEmployeeId"], data["originalBranchCode"],
		data["ip"], data["description"], data["confirmationStatus"], data["createdAt"],
		data["alarmId"], data["branchId"], data["zoneId"], data["partitionId"], data["employeeId"],
	}

	// Check for nil or default values for `old_id` and `deletedAt`
	if data["old_id"] == nil {
		values = append(values, nil) // If `old_id` is nil, append NULL
	} else {
		values = append(values, data["old_id"])
	}

	// Add version and deletedAt
	values = append(values, 0) // version
	if data["deletedAt"] == nil {
		values = append(values, nil) // If `deletedAt` is nil, append NULL
	} else {
		values = append(values, data["deletedAt"])
	}

	// Add dedupHash
	values = append(values, data["dedupHash"])

	// Ensure the number of values matches the number of placeholders
	expectedValues := 21
	if len(values) != expectedValues {
		log.Printf("Mismatch: Expected %d values, but got %d", expectedValues, len(values))
		tx.Rollback() // Rollback the transaction if there's an issue
		return fmt.Errorf("mismatch in the number of values and columns: expected %d, got %d", expectedValues, len(values))
	}

	// Print values for debugging
	fmt.Printf("Number of values to insert: %d\n", len(values))
	fmt.Println("Values:", values)

	// Insert the data into the database using the transaction
	_, err = tx.Exec(query, values...)
	if err != nil {
		log.Printf("Error executing query: %v", err)
		tx.Rollback() // Rollback the transaction on error
		return fmt.Errorf("error saving event data: %w", err)
	}

	// Commit the transaction
	err = tx.Commit()
	if err != nil {
		log.Printf("Error committing transaction: %v", err)
		return fmt.Errorf("error committing transaction: %w", err)
	}

	log.Println("Event saved to database successfully.")

	query = `SELECT COUNT(*) FROM Event`
	var count int
	err = database.DB.QueryRow(query).Scan(&count)
	if err != nil {
		log.Printf("Error counting events: %v", err)
		return fmt.Errorf("error counting events: %w", err)
	}

	log.Printf("Total events in database: %d", count)

	return nil
}
