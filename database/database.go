package database

import (
	"database/sql"
	"fmt"
	"io/ioutil"
	"log"
	"path/filepath"

	_ "github.com/mattn/go-sqlite3" // SQLite driver
)

var DB *sql.DB

func Init() error {
	var err error


	dbPath := "database.db"
	// دریافت مسیر کامل (مطلق) فایل
	absPath, err := filepath.Abs(dbPath)
	if err != nil {
		log.Fatalf("Error getting absolute path: %v", err)
	}

	log.Printf("Using database path: %s\n", absPath)
	
	DB, err = sql.Open("sqlite3", "database.db")
	if err != nil {
		return err
	}

	// Enable foreign key support in SQLite
	_, err = DB.Exec("PRAGMA foreign_keys = ON;")
	if err != nil {
		return err
	}

	// Call migration function if necessary
	err = Migrate()
	if err != nil {
		return err
	}

	return nil
}

func Migrate() error {
	// Apply database migrations
	// You can use sql scripts or an ORM here to apply schema
	// For now, this will just ensure that the schema.sql is applied
	schema, err := ioutil.ReadFile("database/schema.sql")
	if err != nil {
		return err
	}
	_, err = DB.Exec(string(schema))
	if err != nil {
		return err
	}

	fmt.Println("Database schema created successfully.")
	return nil
}
