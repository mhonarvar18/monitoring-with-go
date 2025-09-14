package database

import (
	"fmt"
	"io/ioutil"
	"log"
	"monitoring-with-go/seeders"
	"path/filepath"
	"strings"
	"time"

	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

var DB *gorm.DB

// Init initializes the database connection and applies schema.sql
func Init() (*gorm.DB, error) {
	dbPath := "database.db"

	// مسیر مطلق فایل دیتابیس
	absPath, err := filepath.Abs(dbPath)
	if err != nil {
		return nil, fmt.Errorf("failed to get absolute path: %v", err)
	}
	log.Printf("Using database path: %s\n", absPath)

	// اتصال با GORM
	DB, err = gorm.Open(sqlite.Open(absPath), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Info), // برای لاگ کردن query ها
	})
	if err != nil {
		return nil, fmt.Errorf("failed to connect database: %v", err)
	}

	// فعال کردن foreign key در SQLite
	sqlDB, err := DB.DB()
	if err != nil {
		return nil, fmt.Errorf("failed to get sql.DB from gorm: %v", err)
	}
	_, err = sqlDB.Exec("PRAGMA foreign_keys = ON;")
	if err != nil {
		return nil, fmt.Errorf("failed to enable foreign keys: %v", err)
	}

	// حالا تنظیم connection pool روی sqlDB
	sqlDB.SetMaxOpenConns(20)                 // حداکثر کانکشن باز
	sqlDB.SetMaxIdleConns(10)                 // کانکشن idle
	sqlDB.SetConnMaxLifetime(time.Minute * 5) // مدت زمان حداکثر برای هر کانکشن

	//sqlDB.Exec(`DROP INDEX IF EXISTS idx_event_deduphash_active;`)
	sqlDB.Exec(`CREATE UNIQUE INDEX IF NOT EXISTS idx_event_deduphash_active
         ON "Event"("dedupHash") WHERE "deletedAt" IS NULL;`)
  
	// اجرای schema.sql
	if err := applySchema(); err != nil {
		return nil, fmt.Errorf("failed to apply schema.sql: %v", err)
	}

	// اجرای Seeder
	seeders.SeedUsers(DB)
	seeders.SeedLocations(DB)
	seeders.SeedAlarmCategories(DB)

	return DB, nil
}

// applySchema reads schema.sql and executes it statement by statement
func applySchema() error {
	schemaPath := "database/schema.sql"

	absSchemaPath, err := filepath.Abs(schemaPath)
	if err != nil {
		return fmt.Errorf("failed to get absolute path for schema.sql: %v", err)
	}

	content, err := ioutil.ReadFile(absSchemaPath)
	if err != nil {
		return fmt.Errorf("failed to read schema.sql: %v", err)
	}

	// جدا کردن statement ها با ;
	statements := strings.Split(string(content), ";")
	for _, stmt := range statements {
		stmt = strings.TrimSpace(stmt)
		if stmt == "" {
			continue
		}
		if err := DB.Exec(stmt).Error; err != nil {
			return fmt.Errorf("failed to execute statement: %s, error: %v", stmt, err)
		}
	}

	log.Println("Database schema checked/created successfully.")
	return nil
}
