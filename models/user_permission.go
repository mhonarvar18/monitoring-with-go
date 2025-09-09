package models

import (
	"gorm.io/gorm"
)

type UserPermission struct {
	ID             string         `gorm:"primaryKey;type:text;column:id" json:"id"`
	OldID          int            `gorm:"column:old_id" json:"old_id"`
	ModelID        int            `gorm:"column:modelId" json:"modelId"`
	UserID         string         `gorm:"column:userId" json:"userId"`
	OldPermissionID int           `gorm:"column:old_permissionId" json:"old_permissionId"`
	PermissionID   string         `gorm:"column:permissionId" json:"permissionId"`
	Version        int            `gorm:"column:version;default:0" json:"version"`
	DeletedAt      gorm.DeletedAt `gorm:"column:deletedAt;index" json:"deletedAt"`
}

func (UserPermission) TableName() string {
	return "UserPermission"
}
