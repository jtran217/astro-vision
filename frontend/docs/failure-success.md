# Volleyball Event Success/Failure Classification

## Overview

This document provides standardized criteria for classifying volleyball events as successful or failed attempts, designed for consistent data labeling and machine learning applications.

---

### 🏐 Spike

#### **When to Count as Attempt:**

- Player makes contact with ball above net height with attacking intent
- Includes tips, tooling, and hard-driven attacks
- Must be an intentional offensive action (not deflections)

#### **Success Criteria:**

- ✅ Ball hits opponent's court and results in a point
- ✅ Ball forces a difficult dig from the opposing team
- ✅ Attack creates offensive advantage

#### **Failure Criteria:**

- ❌ Ball goes out of bounds
- ❌ Ball hits the net
- ❌ Ball gets blocked back to attacking team's side
- ❌ Net violation or other rule infraction

---

### 🎯 Serve

#### **When to Count as Attempt:**

- Ball is contacted from behind the service line with intent to serve
- Includes all serve types (overhand, underhand, jump serve, float)
- Count even if server commits foot fault or other violation

#### **Success Criteria:**

- ✅ Ball lands in opponent's court (ace or serviceable)
- ✅ Forces a difficult receive from opposing team
- ✅ Creates offensive advantage for serving team

#### **Failure Criteria:**

- ❌ Ball goes out of bounds
- ❌ Ball hits the net
- ❌ Foot fault or service line violation
- ❌ Other service rule infractions

---

### 🛡️ Block

#### **When to Count as Attempt:**

- Player(s) reach above net height to deflect opponent's attack
- Must be defensive action against an attack (not deflecting a set or pass)
- Includes solo blocks and multiple player blocks

#### **Success Criteria:**

- ✅ Ball is deflected back to opponent's side
- ✅ Ball is slowed down significantly for team to counter-attack
- ✅ Creates defensive advantage

#### **Failure Criteria:**

- ❌ Ball penetrates through or around the block
- ❌ Blocker commits net violation
- ❌ Block attempt results in opponent maintaining attack advantage

---

### 🤿 Dig

#### **When to Count as Attempt:**

- Player makes contact with ball below shoulder height in defensive action
- Responding to opponent's attack (spike, tip, or aggressive play)
- Must be intentional defensive contact (not accidental deflections)

#### **Success Criteria:**

- ✅ Ball is successfully passed up for team to continue rally
- ✅ Creates opportunity for counter-attack
- ✅ Maintains team's defensive position

#### **Failure Criteria:**

- ❌ Ball hits the floor
- ❌ Ball goes out of bounds after contact
- ❌ Results in unplayable ball for teammates
- ❌ Poor dig leads to lost rally

---

### 🙌 Set

#### **When to Count as Attempt:**

- Player makes contact with ball with intent to create attacking opportunity
- Usually the second contact in offensive sequence
- Includes back sets, quick sets, and high sets
- **Includes bump sets when setter must adjust to poor pass**
- **Count as attempt regardless of setting technique used**

#### **Success Criteria:**

- ✅ Ball is placed in optimal position for attacker
- ✅ Creates favorable attacking opportunity
- ✅ Proper tempo and placement for offensive system
- ✅ Bump set that results in attackable ball despite poor pass

#### **Failure Criteria:**

- ❌ Poor placement leads to difficult attack
- ❌ Ball handling error (double contact, lift, etc.)
- ❌ Set results in limited attacking options
- ❌ Bump set that doesn't create viable attacking opportunity

---

### 📨 Pass

#### **When to Count as Attempt:**

- First contact after opponent's serve or attack
- Player attempts to control ball to setter or target area
- Includes serve receive and dig-to-set transitions

#### **Success Criteria:**

- ✅ Ball reaches intended target (setter) in good position
- ✅ Maintains team's offensive system
- ✅ Creates opportunity for organized attack

#### **Failure Criteria:**

- ❌ Ball doesn't reach intended target
- ❌ Ball accidentally goes over the net
- ❌ Creates difficult situation for setter
- ❌ Results in disrupted offensive flow

---

## 📋 General Classification Rules

### Core Principle

- **Success** = Team maintains or gains advantage in the rally
- **Failure** = Team loses advantage or the point
- **Attempt** = Intentional contact with ball in specific skill context

### Implementation Guidelines

- ✓ Binary classification simplifies machine learning training
- ✓ Attempt criteria ensures consistent event counting
- ✓ Focuses on outcome-based evaluation rather than technique
- ✓ Matches real-time coaching assessment methods
- ✓ Provides clear, objective criteria for consistent labeling

---

## 🏷️ Tagging Best Practices

1. **Consistency**: Apply criteria uniformly across all games
2. **Context**: Consider game situation and team strategy
3. **Objectivity**: Focus on measurable outcomes
4. **Timing**: Tag events at moment of contact
5. **Clarity**: When in doubt, err on side of more conservative classification

---
