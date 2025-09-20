package models

import (
	"time"

	"gorm.io/gorm"
)

type AlarmType string
type AlarmProtocol string
type UserAction string

const (
	AlarmTypeZONE     AlarmType     = "ZONE"
	AlarmTypeUSER     AlarmType     = "USER"
	AlarmProtocolTELL AlarmProtocol = "TELL"
	AlarmProtocolIP   AlarmProtocol = "IP"
	UserActionDISARM  UserAction    = "DISARM"
	UserActionARM     UserAction    = "ARM"
	UserActionNONE    UserAction    = "NONE"
)

type Alarm struct {
	ID             string         `gorm:"primaryKey;type:text;column:id" json:"id"`
	OldID          int            `gorm:"column:old_id" json:"old_id"`
	Code           int            `gorm:"column:code" json:"code"`
	Label          string         `gorm:"column:label" json:"label"`
	Type           AlarmType      `gorm:"column:type" json:"type"`
	Protocol       AlarmProtocol  `gorm:"column:protocol" json:"protocol"`
	Description    string         `gorm:"column:description" json:"description"`
	Action         UserAction     `gorm:"column:action;default:'NONE'" json:"action"`
	OldPanelTypeID int            `gorm:"column:old_panelTypeId" json:"old_panelTypeId"`
	CategoryID     *string        `gorm:"column:categoryId" json:"categoryId"`
	PanelTypeID    string         `gorm:"column:panelTypeId" json:"panelTypeId"`
	Version        int            `gorm:"column:version;default:0" json:"version"`
	DeletedAt      gorm.DeletedAt `gorm:"column:deletedAt;index" json:"deletedAt"`
	CreatedAt      time.Time      `gorm:"column:createdAt;autoCreateTime" json:"createdAt"`
	UpdatedAt      time.Time      `gorm:"column:updatedAt;autoUpdateTime" json:"updatedAt"`
}

func (Alarm) TableName() string {
	return "Alarm"
}
