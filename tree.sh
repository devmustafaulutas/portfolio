#!/bin/bash

root="$(pwd)"

# Hariç tutulacak klasörler
excluded_dirs=(
  "node_modules" "bin" "obj" ".git" ".github" ".vscode" ".idea"
  "dist" "build" ".next" "coverage" ".turbo" ".vs" "out" "temp"
  "static" "public" "uploads" "images" "img"
)

# Hariç tutulacak dosyalar (regex)
excluded_files_regex="(
    package-lock\.json|
    pnpm-lock\.yaml|
    yarn\.lock|
    \.map$|
    \.log$|
    \.cache$|
    \.env(\..+)?$|
    \.tmp$|
    \.DS_Store$|
    \.(png|jpg|jpeg|gif|svg|webp|avif|ico)$|
    \.(mp4|mp3|wav|ogg|mov)$|
    \.(pdf|docx|xlsx|csv)$
)"

show_tree() {
    local path="$1"
    local indent="$2"

    # Önce klasörler
    for dir in "$path"/*/; do
        [ -d "$dir" ] || continue
        local name="$(basename "$dir")"

        # Exclude klasör kontrol
        if [[ " ${excluded_dirs[@]} " =~ " ${name} " ]]; then
            continue
        fi

        echo "${indent}+--- $name"
        show_tree "$dir" "${indent}    "
    done

    # Sonra dosyalar
    for file in "$path"/*; do
        [ -f "$file" ] || continue
        local name="$(basename "$file")"

        if [[ "$name" =~ $excluded_files_regex ]]; then
            continue
        fi

        echo "${indent}    $name"
    done
}

show_tree "$root" ""

