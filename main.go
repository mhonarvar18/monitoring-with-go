package main

import (
	"embed"
	"fmt"
	"log"
	"monitoring-with-go/database"
	"monitoring-with-go/services"

	_ "github.com/mattn/go-sqlite3"
	"github.com/wailsapp/wails/v2"
	"github.com/wailsapp/wails/v2/pkg/options"
)

func main() {

	go func() {
		// Start the UDP listener (instead of RabbitMQ consumer)
		err := services.StartUdpListener()
		if err != nil {
			log.Fatalf("Error starting UDP listener: %s", err)
		}
	}()

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

	err := database.Init()
	if err != nil {
		log.Fatalf("Error initializing database: %s", err)
	}

	RunWails()
	fmt.Println("Wails backend app is running...")
}
