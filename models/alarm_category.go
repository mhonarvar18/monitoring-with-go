package models

import (
	"time"
	"gorm.io/gorm"
)

type AlarmCategory struct {
	ID            string         `gorm:"primaryKey;type:text;column:id" json:"id"`
	OldID         int            `gorm:"column:old_id" json:"old_id"`
	Label         string         `gorm:"column:label" json:"label"`
	Code          int            `gorm:"column:code" json:"code"`
	NeedsApproval bool           `gorm:"column:needsApproval;default:false" json:"needsApproval"`
	Priority      string         `gorm:"column:priority;default:'NONE'" json:"priority"`
	CreatedAt     time.Time      `gorm:"column:createdAt;autoCreateTime" json:"createdAt"`
	UpdatedAt     time.Time      `gorm:"column:updatedAt;autoUpdateTime" json:"updatedAt"`
	Version       int            `gorm:"column:version;default:0" json:"version"`
	DeletedAt     gorm.DeletedAt `gorm:"column:deletedAt;index" json:"deletedAt"`
}

func (AlarmCategory) TableName() string {
	return "AlarmCategory"
}
