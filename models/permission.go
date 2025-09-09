package models

import (
	"gorm.io/gorm"
)

type Permission struct {
	ID          string         `gorm:"primaryKey;type:text;column:id" json:"id"`
	Action      string         `gorm:"column:action" json:"action"`
	Model       string         `gorm:"column:model" json:"model"`
	Field       string         `gorm:"column:field" json:"field"`
	Description string         `gorm:"column:description" json:"description"`
	OldID       int            `gorm:"column:old_id" json:"old_id"`
	Version     int            `gorm:"column:version;default:0" json:"version"`
	DeletedAt   gorm.DeletedAt `gorm:"column:deletedAt;index" json:"deletedAt"`
}

func (Permission) TableName() string {
	return "Permission"
}
