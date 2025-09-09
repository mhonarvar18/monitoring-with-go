package models

import (
	"time"
	"gorm.io/gorm"
)

type ZoneType struct {
	ID        string         `gorm:"primaryKey;type:text;column:id" json:"id"`
	OldID     int            `gorm:"column:old_id" json:"old_id"`
	Label     string         `gorm:"column:label" json:"label"`
	CreatedAt time.Time      `gorm:"column:createdAt;autoCreateTime" json:"createdAt"`
	UpdatedAt time.Time      `gorm:"column:updatedAt;autoUpdateTime" json:"updatedAt"`
	Version   int            `gorm:"column:version;default:0" json:"version"`
	DeletedAt gorm.DeletedAt `gorm:"column:deletedAt;index" json:"deletedAt"`
}

func (ZoneType) TableName() string {
	return "ZoneType"
}
