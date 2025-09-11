package main

import (
	"embed"
	"log"
	"monitoring-with-go/database"
	"monitoring-with-go/services"

	_ "github.com/mattn/go-sqlite3"
	"github.com/wailsapp/wails/v2"
	"github.com/wailsapp/wails/v2/pkg/options"
	"gorm.io/gorm"
)

//go:embed frontend/dist/*
var assets embed.FS // Embed all frontend files

func main() {
	// Initialize database first
	db, err := database.Init()
	if err != nil {
		log.Fatalf("❌ Error initializing database: %s", err)
	}

	auth := &services.AuthService{
		DB: db,
	}

	app := &App{
		DB:          db,
		AuthService: auth,
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
		Bind: []interface{}{
			app,
			auth,
		},
	}); err != nil {
		log.Fatalf("❌ Failed to start Wails app: %s", err)
	}
}

// App struct برای bind شدن به frontend
type App struct {
	DB          *gorm.DB
	AuthService *services.AuthService
}
