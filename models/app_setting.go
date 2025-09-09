package models

import (
	"gorm.io/gorm"
)

type AppSetting struct {
	ID        string         `gorm:"primaryKey;type:text;column:id" json:"id"`
	OldID     int            `gorm:"column:old_id" json:"old_id"`
	Key       string         `gorm:"column:key" json:"key"`
	Value     string         `gorm:"column:value" json:"value"`
	IsVisible bool           `gorm:"column:isVisible;default:true" json:"isVisible"`
	Version   int            `gorm:"column:version;default:0" json:"version"`
	DeletedAt gorm.DeletedAt `gorm:"column:deletedAt;index" json:"deletedAt"`
}

func (AppSetting) TableName() string {
	return "AppSetting"
}
