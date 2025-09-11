package seeders

import (
	"log"
	"monitoring-with-go/models"

	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

func SeedUsers(db *gorm.DB) {
	// هش کردن پسوردها
	hashedPassword, _ := bcrypt.GenerateFromPassword([]byte("@Aa123456"), 10)

	users := []models.User{
		{
			Fullname:      "owner",
			Username:      "owner",
			NationalityCode: "0000000000",
			Password:      string(hashedPassword),
			Type:          "OWNER",
			PersonalCode:  "0000000000",
			FatherName:    "father",
			PhoneNumber:   "0000000000",
			Address:       "آدرس کاربر اصلاح شود",
			IP:            "127.0.0.1",
			LocationID:    "33",
		},
	}

	for _, u := range users {
		// اگر یوزری با همین Username یا NationalityCode وجود داشته باشه، ایجاد نکن
		var user models.User
		result := db.Where("username = ? OR nationalityCode = ?", u.Username, u.NationalityCode).First(&user)
		if result.Error == gorm.ErrRecordNotFound {
			if err := db.Create(&u).Error; err != nil {
				log.Println("Error seeding user:", err)
			} else {
				log.Println("Seeded user:", u.Username)
			}
		} else {
			log.Println("User already exists:", u.Username)
		}
	}
}
