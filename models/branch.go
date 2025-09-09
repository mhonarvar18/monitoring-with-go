package models

import (
	"gorm.io/gorm"
	"time"
)

type Branch struct {
	ID                     string         `gorm:"primaryKey;type:text;column:id" json:"id"`
	OldID                  int            `gorm:"column:old_id" json:"old_id"`
	Name                   string         `gorm:"column:name" json:"name"`
	OldLocationID          int            `gorm:"column:old_locationId" json:"old_locationId"`
	Code                   int            `gorm:"column:code" json:"code"`
	Address                string         `gorm:"column:address" json:"address"`
	PhoneNumber            string         `gorm:"column:phoneNumber" json:"phoneNumber"`
	DestinationPhoneNumber string         `gorm:"column:destinationPhoneNumber" json:"destinationPhoneNumber"`
	ImgUrl                 string         `gorm:"column:imgUrl" json:"imgUrl"`
	PanelIp                string         `gorm:"column:panelIp" json:"panelIp"`
	PanelCode              int            `gorm:"column:panelCode" json:"panelCode"`
	EmergencyCall          string         `gorm:"column:emergencyCall" json:"emergencyCall"`
	OldPanelTypeID         int            `gorm:"column:old_panelTypeId" json:"old_panelTypeId"`
	OldReceiverID          int            `gorm:"column:old_receiverId" json:"old_receiverId"`
	CreatedAt              time.Time      `gorm:"column:createdAt;autoCreateTime" json:"createdAt"`
	UpdatedAt              time.Time      `gorm:"column:updatedAt;autoUpdateTime" json:"updatedAt"`
	ReceiverID             string         `gorm:"column:receiverId" json:"receiverId"`
	PanelTypeID            string         `gorm:"column:panelTypeId" json:"panelTypeId"`
	MainPartitionID        string         `gorm:"column:mainPartitionId" json:"mainPartitionId"`
	LocationID             string         `gorm:"column:locationId" json:"locationId"`
	Version                int            `gorm:"column:version;default:0" json:"version"`
	DeletedAt              gorm.DeletedAt `gorm:"column:deletedAt;index" json:"deletedAt"`
}

func (Branch) TableName() string {
	return "Branch"
}
