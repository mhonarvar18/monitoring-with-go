package models

import (
	"gorm.io/gorm"
	"time"
)

type UserSetting struct {
	ID              string         `gorm:"primaryKey;type:text;column:id" json:"id"`
	OldID           int            `gorm:"column:old_id" json:"old_id"`
	AlarmColor      string         `gorm:"column:alarmColor" json:"alarmColor"`
	AudioUrl        string         `gorm:"column:audioUrl" json:"audioUrl"`
	AlarmCategoryID string         `gorm:"column:alarmCategoryId" json:"alarmCategoryId"`
	UserID          string         `gorm:"column:userId" json:"userId"`
	CreatedAt       time.Time      `gorm:"column:createdAt;autoCreateTime" json:"createdAt"`
	UpdatedAt       time.Time      `gorm:"column:updatedAt;autoUpdateTime" json:"updatedAt"`
	Version         int            `gorm:"column:version;default:0" json:"version"`
	DeletedAt       gorm.DeletedAt `gorm:"column:deletedAt;index" json:"deletedAt"`
}

func (UserSetting) TableName() string {
	return "UserSetting"
}
