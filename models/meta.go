package models

import (
	"time"
	"gorm.io/gorm"
)

type Meta struct {
	ID          string         `gorm:"primaryKey;type:text;column:id" json:"id"`
	OldID       int            `gorm:"column:old_id" json:"old_id"`
	Key         string         `gorm:"column:key" json:"key"`
	ProcessID   string         `gorm:"column:processId" json:"processId"`
	Value       string         `gorm:"column:value" json:"value"`
	ExpiresAt   int64          `gorm:"column:expiresAt" json:"expiresAt"`
	TimeElapsed int64          `gorm:"column:timeElapsed" json:"timeElapsed"`
	CreatedAt   time.Time      `gorm:"column:createdAt;autoCreateTime" json:"createdAt"`
	UpdatedAt   time.Time      `gorm:"column:updatedAt;autoUpdateTime" json:"updatedAt"`
	Version     int            `gorm:"column:version;default:0" json:"version"`
	DeletedAt   gorm.DeletedAt `gorm:"column:deletedAt;index" json:"deletedAt"`
}

func (Meta) TableName() string {
	return "Meta"
}
