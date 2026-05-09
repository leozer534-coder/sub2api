package service

import "strings"

const (
	defaultBusinessSiteName     = "LeoAPI"
	defaultBusinessSiteSubtitle = "个人 AI API 中转服务"
)

func resolveBusinessSiteName(value string) string {
	value = strings.TrimSpace(value)
	if value == "" || value == "Sub2API" {
		return defaultBusinessSiteName
	}
	return value
}

func resolveBusinessSiteSubtitle(value string) string {
	value = strings.TrimSpace(value)
	if value == "" || value == "Subscription to API Conversion Platform" || value == "AI API Gateway Platform" {
		return defaultBusinessSiteSubtitle
	}
	return value
}
