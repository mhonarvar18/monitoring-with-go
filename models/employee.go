package models

import (
	"time"
	"gorm.io/gorm"
)

type Employee struct {
	ID           string         `gorm:"primaryKey;type:text;column:id" json:"id"`
	OldID        int            `gorm:"column:old_id" json:"old_id"`
	LocalID      int            `gorm:"column:localId" json:"localId"`
	Name         string         `gorm:"column:name" json:"name"`
	LastName     string         `gorm:"column:lastName" json:"lastName"`
	Position     string         `gorm:"column:position" json:"position"`
	NationalCode string         `gorm:"column:nationalCode" json:"nationalCode"`
	BranchID     string         `gorm:"column:branchId;index" json:"branchId"` // ایندکس برای کوئری سریع
	CreatedAt    time.Time      `gorm:"autoCreateTime;column:createdAt" json:"createdAt"`
	UpdatedAt    time.Time      `gorm:"autoUpdateTime;column:updatedAt" json:"updatedAt"`
	Version      int            `gorm:"column:version;default:0" json:"version"`
	DeletedAt    gorm.DeletedAt `gorm:"column:deletedAt;index" json:"deletedAt"`
}

func (Employee) TableName() string {
	return "Employee"
}
