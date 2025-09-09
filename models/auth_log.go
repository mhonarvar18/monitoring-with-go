package models

import (
	"gorm.io/gorm"
	"time"
)

type AuthLog struct {
	ID         string         `gorm:"primaryKey;type:text;column:id" json:"id"`
	OldID      int            `gorm:"column:old_id" json:"old_id"`
	IP         string         `gorm:"column:ip" json:"ip"`
	LoginTime  time.Time      `gorm:"autoCreateTime;column:loginTime" json:"loginTime"`
	LogoutTime time.Time      `gorm:"column:logoutTime" json:"logoutTime"` // nullable
	UserID     string         `gorm:"column:userId;index" json:"userId"`
	Version    int            `gorm:"column:version;default:0" json:"version"`
	DeletedAt  gorm.DeletedAt `gorm:"column:deletedAt;index" json:"deletedAt"`
}

func (AuthLog) TableName() string {
	return "AuthLog"
}
