# Created on: 2026-05-25
# Author: Finn Konrad
# License: MIT
# Description: Collection of "source"-able Bash Helper Functions.
# Info: DRY is ignored on purpose to maintain the atomicity of each function.

error (){
    printf "%s\n" "ERROR ${2:-1}" >&2
    printf "%s\n" "$1" >&2
    exit 1
}

warning (){
    printf "%s\n" "WARNING" >&2
    printf "%s\n" "$1" >&2
}

info (){
    printf "%s\n" "INFO" >&2
    printf "%s\n" "$1" >&2
}

check_dep (){
    [ "$#" -ge 1 ] || return 1
    local dep
    for dep in "$@"; do
        MINION__CURRENT_PARAMETER="$dep"
        command -v "$dep" >/dev/null 2>&1 || return 1
    done
    return 0
}

check_var (){
    [ "$#" -ge 1 ] || return 1

    local var
    for var in "$@"; do
        MINION__CURRENT_PARAMETER="$var"
        [ -v "$var" ] || return 1
        [ -z "${!var}" ] && return 1
    done

    return 0
}

check_func (){
    [ "$#" -ge 1 ] || return 1

    local func
    for func in "$@"; do
        MINION__CURRENT_PARAMETER="$func"
        [ "$(type -t "$func" 2>/dev/null)" = "function" ] || return 1
    done

    return 0
}

check_empty (){
    [ "$#" -ge 1 ] || return 1

    local string
    for string in "$@"; do
        MINION__CURRENT_PARAMETER="$string"
        [ -z "$string" ] || return 1
    done

    return 0
}

check_content (){
    [ "$#" -ge 1 ] || return 1

    local string
    for string in "$@"; do
        MINION__CURRENT_PARAMETER="$string"
        [ -n "$string" ] || return 1
    done

    return 0
}

check_exists (){
    [ "$#" -ge 1 ] || return 1

    local file
    for file in "$@"; do
        MINION__CURRENT_PARAMETER="$file"
        [ -e "$file" ] || return 1
    done

    return 0
}

check_absent (){
    [ "$#" -ge 1 ] || return 1

    local file
    for file in "$@"; do
        MINION__CURRENT_PARAMETER="$file"
        [ -e "$file" ] && return 1
    done

    return 0
}

check_dir (){
    [ "$#" -ge 1 ] || return 1

    local dir
    for dir in "$@"; do
        MINION__CURRENT_PARAMETER="$dir"
        [ -e "$dir" ] || return 1
        [ -d "$dir" ] || return 1
    done

    return 0
}

check_file (){
    [ "$#" -ge 1 ] || return 1

    local file
    for file in "$@"; do
        MINION__CURRENT_PARAMETER="$file"
        [ -e "$file" ] || return 1
        [ -d "$file" ] && return 1
    done

    return 0
}

check_path (){
    [ "$#" -ge 1 ] || return 1

    local path
    for path in "$@"; do
        path="$(dirname "$path")"
        MINION__CURRENT_PARAMETER="$path"
        [ -e "$path" ] || return 1
        [ -d "$path" ] || return 1
    done

    return 0
}

check_perm (){
    [ "$#" -ge 2 ] || return 1

    local per="$1"
    shift

    local file
    for file in "$@"; do
        MINION__CURRENT_PARAMETER="$file"
        [[ "$per" =~ r ]] && { [ -r "$file" ] || return 1; }
        [[ "$per" =~ w ]] && { [ -w "$file" ] || return 1; }
        [[ "$per" =~ x ]] && { [ -x "$file" ] || return 1; }
    done

    return 0
}

check_path_perm (){
    [ "$#" -ge 2 ] || return 1

    local per="$1"
    shift

    local path
    for path in "$@"; do
        path="$(dirname "$path")"
        MINION__CURRENT_PARAMETER="$path"
        [[ "$per" =~ r ]] && { [ -r "$path" ] || return 1; }
        [[ "$per" =~ w ]] && { [ -w "$path" ] || return 1; }
        [[ "$per" =~ x ]] && { [ -x "$path" ] || return 1; }
    done

    return 0
}

check_size (){
    [ "$#" -ge 1 ] || return 1

    local file
    for file in "$@"; do
        MINION__CURRENT_PARAMETER="$file"
        if [ -d "$file" ]; then
            [ -z "$(ls -A "$file" 2>/dev/null)" ] && return 1
        else
            [ -s "$file" ] || return 1
        fi
    done

    return 0
}

check_dupli (){
    [ "$#" -ge 2 ] || return 0

    local read=()
    local outer_string
    local inner_string

    for outer_string in "$@"; do
        MINION__CURRENT_PARAMETER="$outer_string"
        for inner_string in "${read[@]}"; do
            [ "$outer_string" = "$inner_string" ] && return 1
        done
        read+=("$outer_string")
    done

    return 0
}

check_path_dupli (){
    [ "$#" -ge 2 ] || return 0

    local read=()
    local outer_string
    local inner_string

    for outer_string in "$@"; do
        outer_string="$(realpath "$outer_string")"
        MINION__CURRENT_PARAMETER="$outer_string"
        for inner_string in "${read[@]}"; do
            [ "$outer_string" = "$inner_string" ] && return 1
        done
        read+=("$outer_string")
    done

    return 0
}

init_namespace (){
    if [ ! -v "MINION__TEMPORARY_NAMESPACE" ] || [ -z "$MINION__TEMPORARY_NAMESPACE" ]; then
        MINION__TEMPORARY_NAMESPACE="$(mktemp -d 2>/dev/null)" || return 1
    fi
    return 0
}

del_namespace (){
    [ -v "MINION__TEMPORARY_NAMESPACE" ] || return 0
    local dir="$MINION__TEMPORARY_NAMESPACE"

    if [ -z "$dir" ]; then
        unset "MINION__TEMPORARY_NAMESPACE" || return 1
        return 0
    fi

    [[ "$dir" =~ ^\/tmp\/.+ ]] || return 1
    [[ "$dir" =~ (\/\.{2}\/|\/\.{2}$) ]] && return 1

    unset "MINION__TEMPORARY_NAMESPACE" || return 1
    rm -rf "$dir" || return 1
    return 0
}

mktmp_dir (){
    if [ ! -v "MINION__TEMPORARY_NAMESPACE" ] || [ -z "$MINION__TEMPORARY_NAMESPACE" ]; then
        return 1
    fi

    local dir
    dir="$(mktemp -p "$MINION__TEMPORARY_NAMESPACE" -d 2>/dev/null)" || return 1
    printf "%s" "$dir"
    return 0
}

mktmp_file (){
    if [ ! -v "MINION__TEMPORARY_NAMESPACE" ] || [ -z "$MINION__TEMPORARY_NAMESPACE" ]; then
        return 1
    fi

    local file
    file="$(mktemp -p "$MINION__TEMPORARY_NAMESPACE" 2>/dev/null)" || return 1
    printf "%s" "$file"
    return 0
}

mktmp_name (){
    if [ ! -v "MINION__TEMPORARY_NAMESPACE" ] || [ -z "$MINION__TEMPORARY_NAMESPACE" ]; then
        return 1
    fi

    local name
    name="$(mktemp -p "$MINION__TEMPORARY_NAMESPACE" -u 2>/dev/null)" || return 1
    printf "%s" "$name"
    return 0
}

source_file (){
    [ "$#" -ge 1 ] || return 1

    local file
    for file in "$@"; do
        MINION__CURRENT_PARAMETER="$file"
        [ -e "$file" ] || return 1
        [ -d "$file" ] && return 1
        [ -r "$file" ] || return 1
        source "$file" >/dev/null 2>&1 || return 1
    done

    return 0
}

input_std (){
    [ "$#" -eq 1 ] || return 1
    [ -z "$1" ] && return 1

    local input=""
    while [ -z "$input" ]; do
        printf "%s" "$1" >&2
        IFS= read -r input || return 1
    done

    printf "%s" "$input"
    return 0
}

input_sens (){
    [ "$#" -eq 1 ] || return 1
    [ -z "$1" ] && return 1
    
    local input=""
    while [ -z "$input" ]; do
        printf "%s" "$1" >&2
        IFS= read -rs input || return 1
    done

    printf "\n" >&2
    printf "%s" "$input"
    return 0
}

input_react (){
    [ "$#" -eq 1 ] || return 1
    [ -z "$1" ] && return 1

    local input=""
    printf "%s" "$1" >&2
    IFS= read -r input || return 1

    return 0
}

input_conf (){
    [ "$#" -eq 1 ] || return 1
    [ -z "$1" ] && return 1

    local input=""
    while [ -z "$input" ]; do
        printf "%s" "$1" >&2
        IFS= read -r input || return 1
    done

    input=${input:0:1}
    input=${input,,}
    printf "%s" "$input"
    return 0
}

get_last (){
    local var="MINION__CURRENT_PARAMETER"
    [ -v "$var" ] || return 1
    [ -z "${!var}" ] && return 1

    printf "%s" "${!var}"
    return 0
}
