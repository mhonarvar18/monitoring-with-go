package models

import (
	"time"
	"gorm.io/gorm"
)

type Equipment struct {
	ID        string         `gorm:"primaryKey;type:text;column:id" json:"id"`
	OldID     int            `gorm:"column:old_id" json:"old_id"`
	Name      string         `gorm:"column:name" json:"name"`
	Model     string         `gorm:"column:model" json:"model"`
	ImgUrl    string         `gorm:"column:imgUrl" json:"imgUrl"`
	BranchID  string         `gorm:"column:branchId;index" json:"branchId"` // ایندکس برای جستجو
	CreatedAt time.Time      `gorm:"autoCreateTime;column:createdAt" json:"createdAt"`
	UpdatedAt time.Time      `gorm:"autoUpdateTime;column:updatedAt" json:"updatedAt"`
	Version   int            `gorm:"column:version;default:0" json:"version"`
	DeletedAt gorm.DeletedAt `gorm:"column:deletedAt;index" json:"deletedAt"`
}

func (Equipment) TableName() string {
	return "Equipment"
}
