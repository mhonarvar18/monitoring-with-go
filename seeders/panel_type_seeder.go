package seeders

import (
	"log"
	"time"
	"monitoring-with-go/models"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

func SeedPanelTypes(db *gorm.DB) {
	// بررسی اینکه آیا جدول PanelType دارای داده است یا خیر
	var cnt int64
	if err := db.Model(&models.PanelType{}).Count(&cnt).Error; err != nil {
		log.Fatalf("count PanelTypes: %v", err)
	}

	if cnt > 0 {
		log.Println("ℹ️ Panel Types already seeded; skipping.")
		return
	}

	// انواع مختلف PanelType
	panelTypes := []models.PanelType{
		{ID: uuid.NewString(), Name: "PZH-MCU", Model: "PAZHONIC", Delimiter: ";", EventFormat: []string{"year", "month", "day", "hour", "minute", "second", "panelCode", "alarmCode", "zoneId", "employeeId", "partitionNumber", "eventReference"}, Code: 1, CreatedAt: time.Now(), UpdatedAt: time.Now()},
		{ID: uuid.NewString(), Name: "PZH-PI", Model: "PAZHONIC", Delimiter: ";", EventFormat: []string{"year", "month", "day", "hour", "minute", "second", "panelCode", "alarmCode", "zoneId", "employeeId", "partitionNumber", "eventReference"}, Code: 2, CreatedAt: time.Now(), UpdatedAt: time.Now()},
		{ID: uuid.NewString(), Name: "PZH-TELL", Model: "ANY", Delimiter: ";", EventFormat: []string{}, Code: 3, CreatedAt: time.Now(), UpdatedAt: time.Now()},
	}

	// اضافه کردن PanelType‌ها به دیتابیس
	for _, panelType := range panelTypes {
		var existing models.PanelType
		// بررسی می‌کنیم که آیا PanelType قبلاً موجود است یا نه
		tx := db.Where("name = ?", panelType.Name).First(&existing)
		if tx.Error == gorm.ErrRecordNotFound {
			// اگر موجود نبود، آن را اضافه می‌کنیم
			if err := db.Create(&panelType).Error; err != nil {
				log.Fatalf("create panel type: %v", err)
			} else {
				log.Printf("Seeded panel type: %v", panelType.Name)
			}
		} else if tx.Error != nil {
			log.Printf("Error checking panel type: %v", tx.Error)
		}
	}

	log.Println("✅ Panel Types seeded successfully.")
}
