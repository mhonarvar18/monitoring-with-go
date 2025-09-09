package models

import (
	"time"
	"gorm.io/gorm"
)

type Partition struct {
	ID                string         `gorm:"primaryKey;type:text;column:id" json:"id"`
	OldID             int            `gorm:"column:old_id" json:"old_id"`
	Label             string         `gorm:"column:label" json:"label"`
	LocalID           int            `gorm:"column:localId" json:"localId"`
	CreatedAt         time.Time      `gorm:"column:createdAt;autoCreateTime" json:"createdAt"`
	UpdatedAt         time.Time      `gorm:"column:updatedAt;autoUpdateTime" json:"updatedAt"`
	OldBranchDefaultID int           `gorm:"column:old_branchDefaultId" json:"old_branchDefaultId"`
	BranchID          string         `gorm:"column:branchId" json:"branchId"`
	BranchDefaultID   string         `gorm:"column:branchDefaultId" json:"branchDefaultId"`
	Version           int            `gorm:"column:version;default:0" json:"version"`
	DeletedAt         gorm.DeletedAt `gorm:"column:deletedAt;index" json:"deletedAt"`
}

func (Partition) TableName() string {
	return "Partition"
}
