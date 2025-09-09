package models

import (
	"time"
	"gorm.io/gorm"
	"gorm.io/datatypes"
)

type ActionLog struct {
	ID            string         `gorm:"primaryKey;type:text;column:id" json:"id"`
	OldID         int            `gorm:"column:old_id" json:"old_id"`
	Model         string         `gorm:"column:model" json:"model"`
	Action        string         `gorm:"column:action" json:"action"`
	Note          string         `gorm:"column:note" json:"note"`
	UserInfo      datatypes.JSON `gorm:"column:userInfo" json:"userInfo"`
	ChangedFields datatypes.JSON `gorm:"column:changedFields" json:"changedFields"`
	CreatedAt     time.Time      `gorm:"column:createdAt;autoCreateTime" json:"createdAt"`
	UserID        string         `gorm:"column:userId" json:"userId"`
	ModelID       string         `gorm:"column:model_id" json:"model_id"`
	Version       int            `gorm:"column:version;default:0" json:"version"`
	DeletedAt     gorm.DeletedAt `gorm:"column:deletedAt;index" json:"deletedAt"`
}

func (ActionLog) TableName() string {
	return "ActionLog"
}
