---
layout: post
title:  "Common Tmux Commands"
date:   2024-11-06 08:17:10 -0400
categories: jekyll update
tag: tmux
---

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

- [Common Tmux Commands](#common-tmux-commands)
  - [Basic Session Management](#basic-session-management)
    - [Create a New Session](#create-a-new-session)
    - [List All Sessions](#list-all-sessions)
    - [Attach to an Existing Session:](#attach-to-an-existing-session)
    - [Detach from the Current Session](#detach-from-the-current-session)
    - [Kill a Session](#kill-a-session)
  - [Window Management](#window-management)
    - [Create a New Window](#create-a-new-window)
    - [Switch Between Windows](#switch-between-windows)
    - [Rename a Window](#rename-a-window)
    - [Close the Current Window:](#close-the-current-window)
  - [Pane Management](#pane-management)
    - [Split Pane Horizontally](#split-pane-horizontally)
    - [Split Pane Vertically](#split-pane-vertically)
    - [Switch Between Panes](#switch-between-panes)
    - [Resize Pane](#resize-pane)
    - [Close the Current Pane](#close-the-current-pane)
  - [Other Useful Commands](#other-useful-commands)
    - [Show Keybinding Help](#show-keybinding-help)
    - [Copy Mode](#copy-mode)
    - [Reload Configuration File](#reload-configuration-file)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# Common Tmux Commands

Below are some commonly used `tmux` commands to help you quickly get started and efficiently use `tmux`:

## Basic Session Management

### Create a New Session

```
tmux new -s <session_name>
```

Creates a new session with the name <session_name>.

### List All Sessions

```
tmux ls
```

Lists all current tmux sessions.

### Attach to an Existing Session:

```
tmux attach -t <session_name>
```

Attaches to the specified <session_name> session.

### Detach from the Current Session

Press `Ctrl + b`, then press `d` to detach from the current session without affecting the tasks in it.

### Kill a Session

```
tmux kill-session -t <session_name>
```

Closes the specified <session_name> session.

## Window Management

### Create a New Window

Press `Ctrl + b`, then `c` to create a new window.

### Switch Between Windows

Press `Ctrl + b`, then `n` to switch to the next window, or `p` to go to the previous window.

Alternatively, press `Ctrl + b` followed by a number key (like 0, 1, etc.) to directly jump to that window.

### Rename a Window

Press `Ctrl + b`, then `,` to rename the current window.

### Close the Current Window:

Use `exit` or `Ctrl + d` to close the current window.

## Pane Management

### Split Pane Horizontally

Press `Ctrl + b`, then `"` to split the current window into two panes horizontally.

### Split Pane Vertically

Press `Ctrl + b`, then `%` to split the current window into two panes vertically.

### Switch Between Panes

Press `Ctrl + b`, then use the arrow keys (up, down, left, right) to switch between panes.

### Resize Pane

Press `Ctrl + b`, then `:` to enter command mode, and type `resize-pane -U` (up), `resize-pane -D` (down), etc., to adjust the pane size.

### Close the Current Pane

Use `exit` or `Ctrl + d`.

## Other Useful Commands

### Show Keybinding Help

Press `Ctrl + b`, then `?` to display all keybindings.

### Copy Mode

Press `Ctrl + b`, then `[` to enter copy mode and scroll through the history.

### Reload Configuration File

Press `Ctrl + b`, then `:` to enter command mode, and type `source-file ~/.tmux.conf` to reload the configuration.

These commands can help you manage sessions, windows, and panes effectively, enhancing your workflow.