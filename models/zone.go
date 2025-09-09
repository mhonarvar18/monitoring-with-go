package models

import (
	"gorm.io/gorm"
	"time"
)

type Zone struct {
	ID          string         `gorm:"primaryKey;type:text;column:id" json:"id"`
	OldID       int            `gorm:"column:old_id" json:"old_id"`
	LocalID     int            `gorm:"column:localId" json:"localId"`
	Label       string         `gorm:"column:label" json:"label"`
	ZoneTypeID  string         `gorm:"column:zoneTypeId" json:"zoneTypeId"`
	PartitionID string         `gorm:"column:partitionId" json:"partitionId"`
	CreatedAt   time.Time      `gorm:"column:createdAt;autoCreateTime" json:"createdAt"`
	UpdatedAt   time.Time      `gorm:"column:updatedAt;autoUpdateTime" json:"updatedAt"`
	Version     int            `gorm:"column:version;default:0" json:"version"`
	DeletedAt   gorm.DeletedAt `gorm:"column:deletedAt;index" json:"deletedAt"`
}

func (Zone) TableName() string {
	return "Zone"
}
