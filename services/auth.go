package services

import (
	"errors"
	"monitoring-with-go/models"

	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

type AuthService struct {
	DB *gorm.DB
}

type LoginRequest struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

type LoginResponse struct {
	ID              string `json:"id"`
	Username        string `json:"username"`
	Fullname        string `json:"fullname"`
	NationalityCode string `json:"nationalityCode"`
	PersonalCode    string `json:"personalCode"`
	FatherName      string `json:"fatherName"`
	PhoneNumber     string `json:"phoneNumber"`
	LocationID      string `json:"locationId"`
	Address         string `json:"address"`
	Status          string `json:"status"`
	AvatarUrl       string `json:"avatarUrl,omitempty"`
	Version         int    `json:"version"`
}

type LogoutResponse struct {
	StatusCode int    `json:"statusCode"`
	Message    string `json:"message"`
}

type RegisterRequest struct {
	Username        string `json:"username"`
	Password        string `json:"password"`
	ConfirmPassword string `json:"confirmPassword,omitempty"`
	Fullname        string `json:"fullname"`
	NationalityCode string `json:"nationalityCode"`
	PersonalCode    string `json:"personalCode"`
	FatherName      string `json:"fatherName"`
	PhoneNumber     string `json:"phoneNumber"`
	LocationID      int    `json:"locationId"`
	Address         string `json:"address"`
}

type RegisterResponse struct {
	StatusCode int    `json:"statusCode"`
	Message    string `json:"message"`
}



// Login method exposed to frontend
func (s *AuthService) Login(username, password string) (*LoginResponse, error) {
	var user models.User

	// پیدا کردن کاربر
	result := s.DB.Where("username = ?", username).First(&user)
	if errors.Is(result.Error, gorm.ErrRecordNotFound) {
		return nil, errors.New("user not found")
	}

	// چک کردن پسورد
	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(password)); err != nil {
		return nil, errors.New("invalid password")
	}

	// برگرداندن اطلاعات کاربر (بدون token)
	return &LoginResponse{
		ID:              user.ID,
		Username:        user.Username,
		Fullname:        user.Fullname,
		NationalityCode: user.NationalityCode,
		PersonalCode:    user.PersonalCode,
		FatherName:      user.FatherName,
		PhoneNumber:     user.PhoneNumber,
		LocationID:      user.LocationID,
		Address:         user.Address,
		Status:          user.Status,
		AvatarUrl:       user.AvatarUrl,
		Version:         user.Version,
	}, nil
}

func (s *AuthService) Logout(token string) (*LogoutResponse, error) {
	var user models.User
	result := s.DB.Where("ip = ?", token).First(&user)
	if errors.Is(result.Error, gorm.ErrRecordNotFound) {
		return nil, errors.New("invalid token")
	}

	user.IP = ""
	s.DB.Save(&user)

	return &LogoutResponse{
		StatusCode: 200,
		Message:    "Logged out successfully",
	}, nil
}

func (s *AuthService) Register(req RegisterRequest) (*RegisterResponse, error) {
	if req.Password != req.ConfirmPassword {
		return nil, errors.New("passwords do not match")
	}

	// چک اگر یوزرنیم تکراریه
	var existing models.User
	if err := s.DB.Where("username = ?", req.Username).First(&existing).Error; err == nil {
		return nil, errors.New("username already exists")
	}

	// هش کردن پسورد
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), 10)
	if err != nil {
		return nil, err
	}

	user := models.User{
		ID:              uuid.New().String(),
		Fullname:        req.Fullname,
		Username:        req.Username,
		Password:        string(hashedPassword),
		NationalityCode: req.NationalityCode,
		PersonalCode:    req.PersonalCode,
		FatherName:      req.FatherName,
		PhoneNumber:     req.PhoneNumber,
		LocationID:      string(req.LocationID),
		Address:         req.Address,
		Status:          "OFFLINE",
		Version:         0,
	}

	if err := s.DB.Create(&user).Error; err != nil {
		return nil, err
	}

	return &RegisterResponse{
		StatusCode: 201,
		Message:    "User registered successfully",
	}, nil
}


