package models

import (
	"time"
	"gorm.io/gorm"
)

type PanelType struct {
	ID          string         `gorm:"primaryKey;type:text;column:id" json:"id"`
	OldID       int            `gorm:"column:old_id" json:"old_id"`
	Name        string         `gorm:"column:name" json:"name"`
	Model       string         `gorm:"column:model" json:"model"`
	Code        int            `gorm:"column:code" json:"code"`
	Delimiter   string         `gorm:"column:delimiter" json:"delimiter"`
	EventFormat []string       `gorm:"column:eventFormat;type:text[]" json:"eventFormat"`
	CreatedAt   time.Time      `gorm:"column:createdAt;autoCreateTime" json:"createdAt"`
	UpdatedAt   time.Time      `gorm:"column:updatedAt;autoUpdateTime" json:"updatedAt"`
	Version     int            `gorm:"column:version;default:0" json:"version"`
	DeletedAt   gorm.DeletedAt `gorm:"column:deletedAt;index" json:"deletedAt"`
}

func (PanelType) TableName() string {
	return "PanelType"
}
