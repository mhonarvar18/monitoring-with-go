package models

import (
	"time"
	"gorm.io/gorm"
)

type Receiver struct {
	ID        string         `gorm:"primaryKey;type:text;column:id" json:"id"`
	OldID     int            `gorm:"column:old_id" json:"old_id"`
	Token     string         `gorm:"column:token" json:"token"`
	Model     string         `gorm:"column:model" json:"model"`
	Protocol  string         `gorm:"column:protocol" json:"protocol"`
	DedupHash string         `gorm:"column:dedupHash;type:text;index" json:"dedupHash"` // هش یکتا برای deduplication
	Version   int            `gorm:"column:version;default:0" json:"version"`
	CreatedAt time.Time      `gorm:"column:createdAt;autoCreateTime" json:"createdAt"`
	UpdatedAt time.Time      `gorm:"column:updatedAt;autoUpdateTime" json:"updatedAt"`
	DeletedAt gorm.DeletedAt `gorm:"column:deletedAt;index" json:"deletedAt"`
}

func (Receiver) TableName() string {
	return "Receiver"
}
