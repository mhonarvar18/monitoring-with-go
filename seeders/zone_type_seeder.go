package seeders

import (
	"log"
	"monitoring-with-go/models"
	"github.com/google/uuid"
	"gorm.io/gorm"
	"time"
)

func SeedZoneTypes(db *gorm.DB) {
	// بررسی اینکه آیا جدول ZoneType دارای داده هست یا نه
	var cnt int64
	if err := db.Model(&models.ZoneType{}).Count(&cnt).Error; err != nil {
		log.Fatalf("count ZoneTypes: %v", err)
	}

	if cnt > 0 {
		log.Println("ℹ️ Zone Types already seeded; skipping.")
		return
	}

	// نوع‌های زون برای اضافه کردن
	zoneTypes := []models.ZoneType{
		{ID: uuid.NewString(), Label: "تاخیری", CreatedAt: time.Now(), UpdatedAt: time.Now()},
		{ID: uuid.NewString(), Label: "فوری", CreatedAt: time.Now(), UpdatedAt: time.Now()},
		{ID: uuid.NewString(), Label: "گاز CO2", CreatedAt: time.Now(), UpdatedAt: time.Now()},
		{ID: uuid.NewString(), Label: "حریق", CreatedAt: time.Now(), UpdatedAt: time.Now()},
		{ID: uuid.NewString(), Label: "پدال", CreatedAt: time.Now(), UpdatedAt: time.Now()},
		{ID: uuid.NewString(), Label: "تمپر", CreatedAt: time.Now(), UpdatedAt: time.Now()},
		{ID: uuid.NewString(), Label: "نشت آب", CreatedAt: time.Now(), UpdatedAt: time.Now()},
		{ID: uuid.NewString(), Label: "شکست شیشه", CreatedAt: time.Now(), UpdatedAt: time.Now()},
	}

	// اضافه کردن نوع‌های زون به جدول
	for _, zoneType := range zoneTypes {
		var existing models.ZoneType
		// چک می‌کنیم که آیا نوع زون قبلاً موجود است یا نه
		tx := db.Where("label = ?", zoneType.Label).First(&existing)
		if tx.Error == gorm.ErrRecordNotFound {
			// اگر وجود نداشت، نوع جدید اضافه می‌شود
			if err := db.Create(&zoneType).Error; err != nil {
				log.Fatalf("create zone type: %v", err)
			} else {
				log.Printf("Seeded zone type: %v", zoneType.Label)
			}
		} else if tx.Error != nil {
			log.Printf("Error checking zone type: %v", tx.Error)
		}
	}

	log.Println("✅ Zone Types seeded successfully.")
}
