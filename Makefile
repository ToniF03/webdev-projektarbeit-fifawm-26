# Project: Vanilla Web Development Template
# Created on: 2026-05-22
# Author: Finn Konrad
# License: MIT
# Description: A Makefile that orchestrates the whole lifecycle of the web development environment.

# Root directory

INDEX_HTML = index.html

# Source directory

SRC_DIR = src

HTML_DIR_NAME = html
CSS_DIR_NAME = css
JS_DIR_NAME = js

LIB_DIR_NAME = lib
MAIN_DIR_NAME = main
TEST_DIR_NAME = test

# Scripts directory

SCRIPT_DIR = bin

# Build directory

BUILD_DIR = build

# Npm config directory

NPM_CONFIG_DIR = config

STYLELINT_CONFIG_NAME = stylelint.config.mjs
ESLINT_CONFIG_NAME = eslint.config.mjs
VITEST_CONFIG_NAME = vitest.config.js

# Server

SERVER_PORT = 8080

# Path generation

HTML_PATH = $(SRC_DIR)/$(HTML_DIR_NAME)
CSS_PATH = $(SRC_DIR)/$(CSS_DIR_NAME)
JS_PATH = $(SRC_DIR)/$(JS_DIR_NAME)

LIB_PATH = $(JS_PATH)/$(LIB_DIR_NAME)
MAIN_PATH = $(JS_PATH)/$(MAIN_DIR_NAME)
TEST_PATH = $(JS_PATH)/$(TEST_DIR_NAME)

STYLELINT_PATH = $(NPM_CONFIG_DIR)/$(STYLELINT_CONFIG_NAME)
ESLINT_PATH = $(NPM_CONFIG_DIR)/$(ESLINT_CONFIG_NAME)
VITEST_PATH = $(NPM_CONFIG_DIR)/$(VITEST_CONFIG_NAME)

.PHONY: default install help lint lint-html lint-css lint-js test-js start-server stop-server open-site strip-src build-site clean

default: help

install: | $(SCRIPT_DIR)
	"$(SCRIPT_DIR)/checkdeps"
	npm ci

%.html: | $(SCRIPT_DIR)
	"$(SCRIPT_DIR)/mkhtml" "$@"

%.css: | $(SCRIPT_DIR)
	"$(SCRIPT_DIR)/mkcss" "$@"

%.js: | $(SCRIPT_DIR)
	"$(SCRIPT_DIR)/mkjs" "$@"

%.sh: | $(SCRIPT_DIR)
	"$(SCRIPT_DIR)/mksh" "$@"

lint: | $(HTML_PATH) $(CSS_PATH) $(JS_PATH) $(NPM_CONFIG_DIR)
	@printf "%s\n\n" "==================== HTML ===================="
	-npx vnu "$(INDEX_HTML)" "$(HTML_PATH)"
	@printf "\n"
	@printf "%s\n\n" "==================== CSS ====================="
	-npx stylelint --config "$(STYLELINT_PATH)" "$(CSS_PATH)"
	@printf "\n"
	@printf "%s\n\n" "===================== JS ====================="
	-npx eslint --config "$(ESLINT_PATH)" "$(JS_PATH)"

lint-html: | $(HTML_PATH)
	@printf "%s\n\n" "==================== HTML ===================="
	npx vnu "$(INDEX_HTML)" "$(HTML_PATH)"

lint-css: | $(CSS_PATH) $(NPM_CONFIG_DIR)
	@printf "%s\n\n" "==================== CSS ====================="
	npx stylelint --config "$(STYLELINT_PATH)" "$(CSS_PATH)"

lint-js: | $(JS_PATH) $(LIB_PATH) $(MAIN_PATH) $(TEST_PATH) $(NPM_CONFIG_DIR)
	@printf "%s\n\n" "===================== JS ====================="
	npx eslint --config "$(ESLINT_PATH)" "$(JS_PATH)"

test-js: | $(TEST_PATH) $(NPM_CONFIG_DIR)
	@printf "%s\n\n" "===================== JS ====================="
	npx vitest run --config "$(VITEST_PATH)" "$(TEST_PATH)"

start-server:
	python3 -m http.server $(SERVER_PORT) 2>/dev/null >&2 &

stop-server:
	pkill -f "python3 -m http.server $(SERVER_PORT)" 2>/dev/null >&2

open-site: start-server
	xdg-open "http://localhost:$(SERVER_PORT)/"

strip-src: | $(SCRIPT_DIR) $(SRC_DIR)
	"$(SCRIPT_DIR)/stripdir" "$(SRC_DIR)"

build-site: strip-src clean | $(SCRIPT_DIR) $(BUILD_DIR)
	"$(SCRIPT_DIR)/bundler" "$(BUILD_DIR)"

clean:
	rm -rf "$(BUILD_DIR)"

$(SRC_DIR):
	mkdir -p "$@"

$(HTML_PATH): | $(SRC_DIR)
	mkdir -p "$@"

$(CSS_PATH): | $(SRC_DIR)
	mkdir -p "$@"

$(JS_PATH): | $(SRC_DIR)
	mkdir -p "$@"

$(LIB_PATH): | $(JS_PATH)
	mkdir -p "$@"

$(MAIN_PATH): | $(JS_PATH)
	mkdir -p "$@"

$(TEST_PATH): | $(JS_PATH)
	mkdir -p "$@"

$(NPM_CONFIG_DIR):
	mkdir -p "$@"

$(SCRIPT_DIR):
	mkdir -p "$@"

$(BUILD_DIR):
	mkdir -p "$@"

help:
	@printf "%s\n\n" "=============== Targets ================"

	@printf "%s\n\n" "------------- Setup & Help -------------"
	@printf "%s\n" "make install      | Checking for dependencies and setting up NPM"
	@printf "%s\n\n" "make help         | Listing all targets"

	@printf "%s\n\n" "------------ File Creation -------------"
	@printf "%s\n" "make **/*.html    | Creating a HTML template file with the given name"
	@printf "%s\n" "make **/*.css     | Creating a CSS template file with the given name"
	@printf "%s\n" "make **/*.js      | Creating a JS template file with the given name"
	@printf "%s\n\n" "make **/*.sh      | Creating a SHELL template file with the given name"

	@printf "%s\n\n" "------------- Code Linting -------------"
	@printf "%s\n" "make lint         | Linting all HTML, CSS and JS files in \"$(SRC_DIR)\""
	@printf "%s\n" "make lint-html    | Linting all HTML files in \"$(HTML_PATH)\""
	@printf "%s\n" "make lint-css     | Linting all CSS files in \"$(CSS_PATH)\""
	@printf "%s\n\n" "make lint-js      | Linting all JS files in \"$(JS_PATH)\""

	@printf "%s\n\n" "---------- Javascript Testing ----------"
	@printf "%s\n\n" "make test-js      | Testing all JS files in \"$(TEST_PATH)\""

	@printf "%s\n\n" "------------ Server & Site -------------"
	@printf "%s\n" "make start-server | Starting the local server on port \"$(SERVER_PORT)\""
	@printf "%s\n" "make stop-server  | Stopping the local server"
	@printf "%s\n\n" "make open-site    | Opening the site hosted on the local server"

	@printf "%s\n\n" "---------------- Build -----------------"
	@printf "%s\n" "make strip-src    | Removing the EXIF data from every file in \"$(SRC_DIR)\""
	@printf "%s\n" "make build-site   | Building the site without dev dependencies into \"$(BUILD_DIR)\""
	@printf "%s\n\n" "make clean        | Clearing \"$(BUILD_DIR)\""

%:
	@printf "%s\n" "INVALID TARGET"
	@exit 1
