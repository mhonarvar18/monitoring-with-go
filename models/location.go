package models

import (
	"gorm.io/gorm"
	"time"
)

type Location struct {
	ID          string         `gorm:"primaryKey;type:text;default:(lower(hex(randomblob(16))));column:id" json:"id"`
	OldID       int            `gorm:"column:old_id" json:"old_id"`
	Label       string         `gorm:"column:label" json:"label"`
	OldParentID int            `gorm:"column:old_parentId" json:"old_parentId"`
	Type        string         `gorm:"column:type" json:"type"`
	ParentID    *string        `gorm:"column:parentId" json:"parentId"`
	Sort        int            `gorm:"column:sort" json:"sort"`
	Version     int            `gorm:"column:version;default:0" json:"version"`
	CreatedAt   time.Time      `gorm:"column:createdAt;autoCreateTime" json:"createdAt"`
	UpdatedAt   time.Time      `gorm:"column:updatedAt;autoUpdateTime" json:"updatedAt"`
	DeletedAt   gorm.DeletedAt `gorm:"column:deletedAt;index" json:"deletedAt"`
}

func (Location) TableName() string {
	return "Location"
}
