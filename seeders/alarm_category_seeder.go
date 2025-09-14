// seeders/alarm_category_seeder.go
package seeders

import (
	"github.com/google/uuid"
	"gorm.io/gorm"
	"log"
	"monitoring-with-go/models"
	"time"
)

func SeedAlarmCategories(db *gorm.DB) {
	// Check if AlarmCategories already exist
	var count int64
	tx := db.Model(&models.AlarmCategory{}).Count(&count)
	if tx.Error != nil {
		log.Fatalf("Failed to check AlarmCategories count: %v", tx.Error)
	}
	if count > 0 {
		log.Println("Alarm categories already exist, skipping seeding.")
		return
	}

	// Define the categories
	categories := []models.AlarmCategory{
		{
			ID:            uuid.NewString(),
			Label:         "حریق",
			Code:          1,
			NeedsApproval: true,
			Priority:      models.PriorityVeryHigh,
			CreatedAt:     time.Now(),
			UpdatedAt:     time.Now(),
		},
		{
			ID:            uuid.NewString(),
			Label:         "سرقت",
			Code:          2,
			NeedsApproval: true,
			Priority:      models.PriorityVeryHigh,
			CreatedAt:     time.Now(),
			UpdatedAt:     time.Now(),
		},
		{
			ID:            uuid.NewString(),
			Label:         "پدال",
			Code:          3,
			NeedsApproval: true,
			Priority:      models.PriorityVeryHigh,
			CreatedAt:     time.Now(),
			UpdatedAt:     time.Now(),
		},
		{
			ID:            uuid.NewString(),
			Label:         "مسلح",
			Code:          4,
			NeedsApproval: true,
			Priority:      models.PriorityMedium,
			CreatedAt:     time.Now(),
			UpdatedAt:     time.Now(),
		},
		{
			ID:            uuid.NewString(),
			Label:         "غیر مسلح",
			Code:          5,
			NeedsApproval: true,
			Priority:      models.PriorityMedium,
			CreatedAt:     time.Now(),
			UpdatedAt:     time.Now(),
		},
		{
			ID:            uuid.NewString(),
			Label:         "هشدار ها",
			Code:          6,
			NeedsApproval: false,
			Priority:      models.PriorityMedium,
			CreatedAt:     time.Now(),
			UpdatedAt:     time.Now(),
		},
	}

	// Insert categories if not already present
	for _, category := range categories {
		var existing models.AlarmCategory
		// Check if the category already exists based on `Code`
		tx := db.Where("code = ?", category.Code).First(&existing)
		if tx.Error == gorm.ErrRecordNotFound {
			// Insert the category if it doesn't exist
			if err := db.Create(&category).Error; err != nil {
				log.Printf("Failed to insert category: %v", err)
			} else {
				log.Printf("Seeded category: %v", category.Label)
			}
		} else if tx.Error != nil {
			log.Printf("Error checking category: %v", tx.Error)
		}
	}

	log.Println("✅ Alarm categories seeded successfully.")
}
