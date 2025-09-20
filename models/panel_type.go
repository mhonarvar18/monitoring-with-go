package models

import (
	"encoding/json"
	"time"
	"gorm.io/gorm"
)

type PanelType struct {
	ID            string         `gorm:"primaryKey;type:text;column:id" json:"id"`
	OldID         int            `gorm:"column:old_id" json:"old_id"`
	Name          string         `gorm:"column:name" json:"name"`
	Model         string         `gorm:"column:model" json:"model"`
	Code          int            `gorm:"column:code" json:"code"`
	Delimiter     string         `gorm:"column:delimiter" json:"delimiter"`
	EventFormat   []string       `gorm:"-" json:"eventFormat"`       // به عنوان []string در ساختار
	EventFormatJSON string       `gorm:"column:eventFormat" json:"-"` // ذخیره به صورت JSON string
	CreatedAt     time.Time      `gorm:"column:createdAt;autoCreateTime" json:"createdAt"`
	UpdatedAt     time.Time      `gorm:"column:updatedAt;autoUpdateTime" json:"updatedAt"`
	Version       int            `gorm:"column:version;default:0" json:"version"`
	DeletedAt     gorm.DeletedAt `gorm:"column:deletedAt;index" json:"deletedAt"`
}

func (panelType *PanelType) BeforeSave(tx *gorm.DB) (err error) {
	// تبدیل EventFormat به JSON string قبل از ذخیره
	if panelType.EventFormat != nil {
		eventFormatBytes, err := json.Marshal(panelType.EventFormat)
		if err != nil {
			return err
		}
		panelType.EventFormatJSON = string(eventFormatBytes)
	}
	return nil
}

func (panelType *PanelType) AfterFind(tx *gorm.DB) (err error) {
	// تبدیل EventFormatJSON به []string بعد از بارگذاری
	if panelType.EventFormatJSON != "" {
		var eventFormat []string
		if err := json.Unmarshal([]byte(panelType.EventFormatJSON), &eventFormat); err != nil {
			return err
		}
		panelType.EventFormat = eventFormat
	}
	return nil
}

func (PanelType) TableName() string {
	return "PanelType"
}
