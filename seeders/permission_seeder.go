package seeders

import (
	"log"
	"gorm.io/gorm"
	"monitoring-with-go/models"
	"github.com/google/uuid"
)

func SeedPermissions(db *gorm.DB) {
	// Check if Permissions already exist
	var count int64
	tx := db.Model(&models.Permission{}).Count(&count)
	if tx.Error != nil {
		log.Fatalf("Failed to check Permissions count: %v", tx.Error)
	}
	if count > 0 {
		log.Println("Permissions already exist, skipping seeding.")
		return
	}

	// Define the permissions
	permissions := []models.Permission{
		{
			ID:          uuid.NewString(),
			OldID:       1,
			Action:      models.PermissionCreate,
			Model:       "Event",
			Field:       nil,
			Description: "تایید رویداد",
			Version:     0,
		},
		{
			ID:          uuid.NewString(),
			OldID:       2,
			Action:      models.PermissionCreate,
			Model:       "User",
			Field:       nil,
			Description: "ایجاد کاربر",
			Version:     0,
		},
		{
			ID:          uuid.NewString(),
			OldID:       3,
			Action:      models.PermissionUpdate,
			Model:       "User",
			Field:       nil,
			Description: "ویرایش کاربر",
			Version:     0,
		},
		{
			ID:          uuid.NewString(),
			OldID:       4,
			Action:      models.PermissionRead,
			Model:       "User",
			Field:       nil,
			Description: "مشاهده کاربر",
			Version:     0,
		},
		// Add other permissions as needed
	}

	// Insert permissions if not already present
	for _, permission := range permissions {
		var existing models.Permission
		// Check if the permission already exists based on `action` and `model`
		tx := db.Where("action = ? AND model = ?", permission.Action, permission.Model).First(&existing)
		if tx.Error == gorm.ErrRecordNotFound {
			// Insert the permission if it doesn't exist
			if err := db.Create(&permission).Error; err != nil {
				log.Printf("Failed to insert permission: %v", err)
			} else {
				log.Printf("Seeded permission: %v", permission.Description)
			}
		} else if tx.Error != nil {
			log.Printf("Error checking permission: %v", tx.Error)
		}
	}

	log.Println("✅ Permissions seeded successfully.")
}
