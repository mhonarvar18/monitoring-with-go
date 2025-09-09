package main

import (
	"embed"
	"log"
	"monitoring-with-go/database"
	"monitoring-with-go/services"

	_ "github.com/mattn/go-sqlite3"
	"github.com/wailsapp/wails/v2"
	"github.com/wailsapp/wails/v2/pkg/options"
)

//go:embed frontend/dist/*
var assets embed.FS // Embed all frontend files

func main() {
	app := &App{}

	// Initialize database first
	err := database.Init()
	if err != nil {
		log.Fatalf("❌ Error initializing database: %s", err)
	}

	// Start UDP listener in background
	go func() {
		err := services.StartUdpListener()
		if err != nil {
			log.Fatalf("❌ Error starting UDP listener: %s", err)
		}
	}()

	// Run Wails frontend/backend
	if err := wails.Run(&options.App{
		Title:  "My Wails App",
		Width:  1200,
		Height: 750,
		Assets: assets,
		Bind:   []interface{}{app},
	}); err != nil {
		log.Fatalf("❌ Failed to start Wails app: %s", err)
	}
}

// App struct برای bind شدن به frontend
type App struct{}

// Login method exposed to frontend
func (a *App) Login(credentials map[string]string) (map[string]interface{}, error) {
	username := credentials["username"]
	password := credentials["password"]

	// TODO: Replace this with real DB check
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
