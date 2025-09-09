package models

import (
	"gorm.io/gorm"
)

type Alarm struct {
	ID             string         `gorm:"primaryKey;type:text;column:id" json:"id"`
	OldID          int            `gorm:"column:old_id" json:"old_id"`
	Code           int            `gorm:"column:code" json:"code"`
	Label          string         `gorm:"column:label" json:"label"`
	Type           string         `gorm:"column:type" json:"type"`
	Protocol       string         `gorm:"column:protocol" json:"protocol"`
	Description    string         `gorm:"column:description" json:"description"`
	Action         string         `gorm:"column:action;default:'NONE'" json:"action"`
	OldPanelTypeID int            `gorm:"column:old_panelTypeId" json:"old_panelTypeId"`
	CategoryID     string         `gorm:"column:categoryId" json:"categoryId"`
	PanelTypeID    string         `gorm:"column:panelTypeId" json:"panelTypeId"`
	Version        int            `gorm:"column:version;default:0" json:"version"`
	DeletedAt      gorm.DeletedAt `gorm:"column:deletedAt;index" json:"deletedAt"`
}

func (Alarm) TableName() string {
	return "Alarm"
}
