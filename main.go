package main

import (
	"database/sql"
	"embed"
	"fmt"
	"io/ioutil"
	"log"

	_ "github.com/mattn/go-sqlite3"
	"github.com/wailsapp/wails/v2"
	"github.com/wailsapp/wails/v2/pkg/options"
)

func main() {
	app := &App{}
	// Call the Run method
	app.Run()
}

//go:embed frontend/dist/*
var assets embed.FS // This embeds all files under the frontend/dist directory

type App struct{}

// Login method to be called from frontend
func (a *App) Login(credentials map[string]string) (map[string]interface{}, error) {
	username := credentials["username"]
	password := credentials["password"]

	// Simulating a login check (replace with your logic)
	if username == "admin" && password == "password123" {
		return map[string]interface{}{
			"success": true,
			"message": "Login successful",
		}, nil
	} else {
		return map[string]interface{}{
			"success": false,
			"message": "Invalid username or password",
		}, nil
	}
}

func RunWails() {
	app := &App{}
	if err := wails.Run(&options.App{
		Title:  "My Wails App",
		Width:  1200,
		Height: 750,
		Assets: assets, // Serve embedded assets
		Bind:   []interface{}{app},
	}); err != nil {
		panic(err)
	}
}

// متد برای اجرای اپلیکیشن
func (a *App) Run() {
	fmt.Println("Backend is running...")

	// اتصال به دیتابیس
	db, err := ConnectToDatabase()
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	// اجرای اسکریپت SQL برای ایجاد جداول
	if err := executeSchema(db); err != nil {
		log.Fatal(err)
	}

	RunWails()
	fmt.Println("Wails backend app is running...")
}

// اتصال به دیتابیس SQLite
func ConnectToDatabase() (*sql.DB, error) {
	db, err := sql.Open("sqlite3", "./database.db")
	if err != nil {
		log.Fatal(err) // Logs the error and terminates the app
	}
	// Activate foreign keys in SQLite
	_, err = db.Exec("PRAGMA foreign_keys = ON;")
	if err != nil {
		log.Fatal(err)
	}

	return db, nil
}


// اجرای اسکریپت SQL
func executeSchema(db *sql.DB) error {
	sqlBytes, err := ioutil.ReadFile("database/schema.sql")
	if err != nil {
		log.Fatal(err)
		return err
	}

	_, err = db.Exec(string(sqlBytes))
	if err != nil {
		log.Fatal(err)
		return err
	}

	fmt.Println("Database schema created successfully.")
	return nil
}
