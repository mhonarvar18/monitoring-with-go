package models

import (
	"gorm.io/gorm"
	"time"
)

type Event struct {
	ID                  string         `gorm:"primaryKey;type:text;column:id" json:"id"`
	OldID               int            `gorm:"column:old_id" json:"old_id"`
	OriginalZoneID      string         `gorm:"column:OriginalZoneId" json:"originalZoneId"`
	OriginalPartitionID string         `gorm:"column:OriginalPartitionId" json:"originalPartitionId"`
	ReferenceID         string         `gorm:"column:ReferenceId" json:"referenceId"`
	Time                string         `gorm:"column:time" json:"time"`
	Date                string         `gorm:"column:date" json:"date"`
	OriginalEmployeeID  string         `gorm:"column:OriginalEmployeeId" json:"originalEmployeeId"`
	OriginalBranchCode  string         `gorm:"column:OriginalBranchCode" json:"originalBranchCode"`
	IP                  string         `gorm:"column:ip" json:"ip"`
	Description         string         `gorm:"column:description" json:"description"`
	ConfirmationStatus  string         `gorm:"column:confirmationStatus" json:"confirmationStatus"`
	AlarmID             string         `gorm:"column:alarmId" json:"alarmId"`
	BranchID            string         `gorm:"column:branchId" json:"branchId"`
	ZoneID              string         `gorm:"column:zoneId" json:"zoneId"`
	PartitionID         string         `gorm:"column:partitionId" json:"partitionId"`
	EmployeeID          string         `gorm:"column:employeeId" json:"employeeId"`
	DedupHash           string         `gorm:"column:dedupHash;index:idx_event_deduphash_active,unique" json:"dedupHash"`
	CreatedAt           time.Time      `gorm:"column:createdAt;autoCreateTime" json:"createdAt"`
	Version             int            `gorm:"column:version;default:0" json:"version"`
	DeletedAt           gorm.DeletedAt `gorm:"column:deletedAt;index" json:"deletedAt"`
}

// TableName explicitly sets the table name to match your DB
func (Event) TableName() string {
	return "Event"
}
