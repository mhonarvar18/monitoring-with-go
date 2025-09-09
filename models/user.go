package models

import (
	"time"
	"gorm.io/gorm"
)

type User struct {
	ID               string         `gorm:"primaryKey;type:text;column:id" json:"id"`
	OldID            int            `gorm:"column:old_id" json:"old_id"`
	Fullname         string         `gorm:"column:fullname" json:"fullname"`
	Username         string         `gorm:"column:username" json:"username"`
	NationalityCode  string         `gorm:"column:nationalityCode" json:"nationalityCode"`
	Password         string         `gorm:"column:password" json:"password"`
	Type             string         `gorm:"column:type" json:"type"`
	PersonalCode     string         `gorm:"column:personalCode" json:"personalCode"`
	AvatarUrl        string         `gorm:"column:avatarUrl" json:"avatarUrl"`
	FatherName       string         `gorm:"column:fatherName" json:"fatherName"`
	PhoneNumber      string         `gorm:"column:phoneNumber" json:"phoneNumber"`
	Address          string         `gorm:"column:address" json:"address"`
	IP               string         `gorm:"column:ip" json:"ip"`
	Status           string         `gorm:"column:status;default:OFFLINE" json:"status"`
	OldLocationID    int            `gorm:"column:old_locationId" json:"old_locationId"`
	ConfirmationTime string         `gorm:"column:confirmationTime" json:"confirmationTime"`
	LocationID       string         `gorm:"column:locationId" json:"locationId"`
	CreatedAt        time.Time      `gorm:"column:createdAt;autoCreateTime" json:"createdAt"`
	UpdatedAt        time.Time      `gorm:"column:updatedAt;autoUpdateTime" json:"updatedAt"`
	Version          int            `gorm:"column:version;default:0" json:"version"`
	DeletedAt        gorm.DeletedAt `gorm:"column:deletedAt;index" json:"deletedAt"`
}

func (User) TableName() string {
	return "User"
}
