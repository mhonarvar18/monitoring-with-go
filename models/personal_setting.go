package models

import (
	"time"
	"gorm.io/gorm"
)

type PersonalSetting struct {
	ID        string         `gorm:"primaryKey;type:text;column:id" json:"id"`
	OldID     int            `gorm:"column:old_id" json:"old_id"`
	Key       string         `gorm:"column:key" json:"key"`
	Value     string         `gorm:"column:value" json:"value"`
	UserID    string         `gorm:"column:userId" json:"userId"`
	Version   int            `gorm:"column:version;default:0" json:"version"`
	CreatedAt time.Time      `gorm:"column:createdAt;autoCreateTime" json:"createdAt"`
	UpdatedAt time.Time      `gorm:"column:updatedAt;autoUpdateTime" json:"updatedAt"`
	DeletedAt gorm.DeletedAt `gorm:"column:deletedAt;index" json:"deletedAt"`
}

func (PersonalSetting) TableName() string {
	return "PersonalSetting"
}
