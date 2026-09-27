import React, { useRef, useState } from 'react';
import {
  Alert,
  Animated,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  PanResponder,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

const colors = {
  ink: '#24324a',
  muted: '#667085',
  line: '#f1d6a2',
  green: '#48a868',
  greenDark: '#24794a',
  orange: '#f26b4f',
  paper: '#fff5d9',
  selected: '#e3f5d5',
  chip: '#ffe49a',
  tomato: '#f26b4f',
  sky: '#78d7dc',
  butter: '#ffd45c',
  lilac: '#c4b5f5',
};

const diets = [
  { label: 'Everything', detail: 'A bit of everything' },
  { label: 'Vegetarian', detail: 'No meat or fish' },
  { label: 'Vegan', detail: 'All plant-based' },
  { label: 'Pescatarian', detail: 'Fish, no other meat' },
];

const goals = ['Save time', 'Healthier eating', 'Lower grocery costs'];
const dietaryNeeds = [
  { label: 'Gluten-free', icon: '🌾' },
  { label: 'Lactose intolerant', icon: '🥛' },
];
const genders = ['Woman', 'Man', 'Non-binary', 'Prefer not to say'];
const activityLevels = ['Mostly sitting', 'Lightly active', 'Active', 'Very active'];
const weightGoals = ['Lose weight', 'Maintain weight', 'Gain weight', 'Build muscle', 'No specific goal'];
const macroFields = [
  { key: 'protein', label: 'Protein' },
  { key: 'carbs', label: 'Carbs' },
  { key: 'fat', label: 'Fat' },
];
const planMethods = [
  {
    label: 'Recommend meals',
    detail: 'Let nibble choose meals that fit your preferences.',
    icon: '✨',
  },
  {
    label: 'I’ll choose meals',
    detail: 'Browse meal ideas and pick the ones you want.',
    icon: '🍽️',
  },
  {
    label: 'Use as many of my ingredients as possible',
    detail: 'Prioritize meals using what is already in your kitchen.',
    icon: '🧺',
  },
];
const moodOptions = [
  { label: 'Comforting', detail: 'Cozy, familiar favorites', emoji: '🍲', color: '#f7dfca' },
  { label: 'Fresh & light', detail: 'Bright, crisp, and colorful', emoji: '🥗', color: '#e0efcf' },
  { label: 'Quick & easy', detail: 'Low effort, lots of flavor', emoji: '⚡', color: '#f8edbd' },
  { label: 'Something new', detail: 'A little culinary adventure', emoji: '🌶️', color: '#f6d7cf' },
];
const mealCatalog = [
  { name: 'Lemony chickpea bowls', detail: 'Herby rice, crunchy cucumber, tahini', emoji: '🥙', time: '25 min', tags: ['Vegetarian', 'High fiber'], moods: ['Fresh & light'], vegetarian: true, vegan: true, glutenFree: true, lactoseFree: true, ingredients: ['chickpeas', 'rice', 'cucumber', 'tahini', 'lemon'], calories: 520, macros: { protein: 18, carbs: 68, fat: 20 }, recipe: ['Cook the rice and let it steam while you prep the toppings.', 'Toss chickpeas with lemon juice, olive oil, salt, and pepper.', 'Fill bowls with rice, cucumber, chickpeas, and tahini. Finish with herbs and lemon.'] },
  { name: 'Ginger sesame noodles', detail: 'Crisp vegetables, toasted sesame', emoji: '🍜', time: '20 min', tags: ['Quick', 'Vegetarian'], moods: ['Quick & easy', 'Fresh & light'], vegetarian: true, vegan: true, glutenFree: false, lactoseFree: true, ingredients: ['wheat noodles', 'soy sauce', 'sesame', 'cabbage', 'ginger'], calories: 610, macros: { protein: 17, carbs: 82, fat: 24 }, recipe: ['Boil the noodles, then rinse them under cold water.', 'Whisk soy sauce, sesame oil, ginger, and a squeeze of lime.', 'Toss noodles and crisp vegetables with the sauce, then sprinkle with sesame.'] },
  { name: 'Roasted tomato orzo', detail: 'Sweet tomatoes, basil, whipped ricotta', emoji: '🍅', time: '35 min', tags: ['Comforting', 'Vegetarian'], moods: ['Comforting'], vegetarian: true, vegan: false, glutenFree: false, lactoseFree: false, ingredients: ['orzo wheat pasta', 'tomatoes', 'basil', 'ricotta'], calories: 570, macros: { protein: 21, carbs: 76, fat: 19 }, recipe: ['Roast tomatoes with olive oil, garlic, salt, and pepper until jammy.', 'Cook the orzo until tender, reserving a splash of pasta water.', 'Stir together the orzo, tomatoes, and basil. Spoon ricotta over each bowl.'] },
  { name: 'Crispy tofu tacos', detail: 'Lime slaw, avocado, smoky salsa', emoji: '🌮', time: '30 min', tags: ['Plant-based', 'High protein'], moods: ['Something new', 'Quick & easy'], vegetarian: true, vegan: true, glutenFree: true, lactoseFree: true, ingredients: ['tofu', 'corn tortillas', 'avocado', 'lime', 'cabbage'], calories: 490, macros: { protein: 24, carbs: 49, fat: 23 }, recipe: ['Press and cube the tofu, then coat it with spices and a little oil.', 'Pan-fry tofu until crisp on every side.', 'Warm tortillas and fill them with tofu, lime slaw, avocado, and salsa.'] },
];
const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const dayPlaceholders = [
  { emoji: '🥗', title: 'Fresh lunch', hint: 'Sample meal slot' },
  { emoji: '🍜', title: 'Noodle night', hint: 'Sample meal slot' },
  { emoji: '🥙', title: 'Quick bowl', hint: 'Sample meal slot' },
  { emoji: '🍲', title: 'Cozy dinner', hint: 'Sample meal slot' },
  { emoji: '🌮', title: 'Taco evening', hint: 'Sample meal slot' },
  { emoji: '🥪', title: 'Weekend lunch', hint: 'Sample meal slot' },
  { emoji: '🥘', title: 'Prep something new', hint: 'Sample meal slot' },
];
const kitchenStickers = [
  { foods: ['👋', '🍓', '🍳'], caption: 'Nice to meet you' },
  { foods: ['🥑', '🍅', '🥦'], caption: 'A colorful plate' },
  { foods: ['🥜', '🍄', '🥛'], caption: 'Your kitchen rules' },
  { foods: ['🥗', '🍓', '🥕'], caption: 'A week that works' },
  { foods: ['💪', '🍎', '🚴'], caption: 'Made for your day' },
  { foods: ['🍽️', '🥑', '💪'], caption: 'Your personal targets' },
];
const questionTitles = [
  'What should we call you?',
  'How do you like to eat?',
  'Any food restrictions?',
  'What are you here for?',
  'A little about you',
  'What are you working toward?',
];
const questionDescriptions = [
  'A name makes your meal plan feel a little more personal.',
  'Choose the eating style that feels right for you.',
  'Add allergies, dislikes, or dietary needs.',
  'Pick every goal that sounds like you.',
  'Optional details help us tailor portions and meal ideas.',
  'Set an optional weight direction, calorie target, and macros.',
];

function SectionNumber({ value }) {
  return (
    <View style={styles.sectionNumber}>
      <Text style={styles.sectionNumberText}>{value}</Text>
    </View>
  );
}

function SectionHeading({ number, title, description }) {
  return (
    <View style={styles.fieldHeading}>
      <View style={styles.fieldTitleRow}>
        <SectionNumber value={number} />
        <Text style={styles.fieldTitle}>{title}</Text>
      </View>
      <Text style={styles.fieldDescription}>{description}</Text>
    </View>
  );
}

function FridgeItemIcon({ name, color, label, onPress, size = 22 }) {
  const [showLabel, setShowLabel] = useState(false);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Add ${label}`}
      onHoverIn={() => setShowLabel(true)}
      onHoverOut={() => setShowLabel(false)}
      onPress={() => {
        setShowLabel(true);
        onPress();
      }}
      title={label}
      style={styles.fridgeItemPressable}
    >
      <Ionicons name={name} size={size} color={color} />
      {showLabel && <View pointerEvents="none" style={styles.fridgeItemTooltip}><Text style={styles.fridgeItemTooltipText}>{label}</Text></View>}
    </Pressable>
  );
}

function getFridgeIngredientVisual(ingredient) {
  const value = ingredient.toLowerCase();
  if (value.includes('milk') || value.includes('yogurt') || value.includes('cheese')) return { name: 'cafe', color: '#b84768' };
  if (value.includes('water') || value.includes('juice') || value.includes('drink')) return { name: 'water', color: '#2d6e9c' };
  if (value.includes('fruit') || value.includes('berry') || value.includes('apple')) return { name: 'nutrition', color: '#b84768' };
  if (value.includes('vegetable') || value.includes('spinach') || value.includes('lettuce')) return { name: 'leaf', color: '#397a4b' };
  if (value.includes('ice') || value.includes('frozen')) return { name: 'snow', color: '#2d6e9c' };
  if (value.includes('snack') || value.includes('bag') || value.includes('bread')) return { name: 'archive', color: '#9a7410' };
  if (value.includes('egg') || value.includes('chicken') || value.includes('meat')) return { name: 'restaurant', color: '#b84768' };
  return { name: 'nutrition', color: '#6554a6' };
}

function FridgeIngredientItem({ ingredient, onPress }) {
  const visual = getFridgeIngredientVisual(ingredient);
  return <FridgeItemIcon name={visual.name} color={visual.color} label={ingredient} onPress={onPress} size={21} />;
}

function NumberStepper({ label, value, unit, onChange, minimum = 0, maximum = 20 }) {
  return (
    <View style={styles.stepperRow}>
      <Text style={styles.detailLabel}>{label}</Text>
      <View style={styles.stepperControl}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Decrease ${label.toLowerCase()}`}
          accessibilityState={{ disabled: value <= minimum }}
          disabled={value <= minimum}
          onPress={() => onChange(Math.max(minimum, value - 1))}
          style={({ pressed }) => [styles.stepperButton, pressed && styles.pressed]}
        >
          <Ionicons name="remove" size={17} color={colors.ink} />
        </Pressable>
        <Text style={styles.stepperValue}>{value} <Text style={styles.stepperUnit}>{unit}</Text></Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Increase ${label.toLowerCase()}`}
          accessibilityState={{ disabled: value >= maximum }}
          disabled={value >= maximum}
          onPress={() => onChange(Math.min(maximum, value + 1))}
          style={({ pressed }) => [styles.stepperButton, pressed && styles.pressed]}
        >
          <Ionicons name="add" size={17} color={colors.ink} />
        </Pressable>
      </View>
    </View>
  );
}

function DraggableMealCard({ meal, onDrop, onOpen, onSelectMove, onDragStart, onDragEnd, selectedForMove }) {
  const [dragging, setDragging] = useState(false);
  const position = useRef(new Animated.ValueXY()).current;
  const cardRef = useRef(null);
  const dragStartCenterY = useRef(0);
  const responder = useRef(PanResponder.create({
    onStartShouldSetPanResponder: () => false,
    onMoveShouldSetPanResponder: (event, gesture) => Math.abs(gesture.dx) + Math.abs(gesture.dy) > 7,
    onPanResponderTerminationRequest: () => false,
    onPanResponderGrant: () => {
      setDragging(true);
      onDragStart();
      cardRef.current?.measureInWindow((x, y, width, height) => {
        dragStartCenterY.current = y + height / 2;
      });
    },
    onPanResponderMove: Animated.event([null, { dx: position.x, dy: position.y }], { useNativeDriver: false }),
    onPanResponderRelease: (event, gesture) => {
      setDragging(false);
      onDrop(dragStartCenterY.current + gesture.dy);
      onDragEnd();
      Animated.spring(position, {
        toValue: { x: 0, y: 0 },
        useNativeDriver: false,
        speed: 24,
        bounciness: 2,
      }).start();
    },
    onPanResponderTerminate: () => {
      setDragging(false);
      onDragEnd();
      Animated.spring(position, { toValue: { x: 0, y: 0 }, useNativeDriver: false }).start();
    },
  })).current;

  return (
    <View style={styles.calendarMealRow}>
      <Animated.View
        ref={cardRef}
        {...responder.panHandlers}
        accessibilityRole="adjustable"
        accessibilityLabel={`${meal.name}, drag to move to another day`}
        style={[
          styles.calendarMealCard,
          dragging && styles.calendarMealDragging,
          selectedForMove && styles.calendarMealSelected,
          { transform: position.getTranslateTransform() },
        ]}
      >
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`View ${meal.name}`}
          onPress={onOpen}
          style={styles.calendarMealPressable}
        >
          <Text style={styles.calendarMealEmoji}>{meal.emoji}</Text>
          <View style={styles.calendarMealCopy}>
            <Text style={styles.calendarMealName}>{meal.name}</Text>
            <Text style={styles.calendarMealTime}>{meal.time}</Text>
          </View>
          <Ionicons name="chevron-forward" size={17} color="#f26b4f" />
        </Pressable>
      </Animated.View>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Choose a day for ${meal.name}`}
        onPress={onSelectMove}
        hitSlop={7}
        style={styles.calendarMoveHandle}
      >
        <Ionicons name={selectedForMove ? 'checkmark-circle' : 'reorder-two-outline'} size={19} color={selectedForMove ? '#4d8b57' : '#6f806f'} />
      </Pressable>
    </View>
  );
}

function TagInput({ number, label, description, value, onChange, placeholder }) {
  const [draft, setDraft] = useState('');

  function addTag() {
    const tag = draft.trim();
    if (tag && !value.some((item) => item.toLowerCase() === tag.toLowerCase())) {
      onChange([...value, tag]);
    }
    setDraft('');
  }

  return (
    <View style={styles.fieldGroup}>
      <View style={styles.answerHint}>
        <View style={styles.fieldTitleRow}>
          <SectionNumber value={number} />
          <Text style={styles.fieldTitle}>{label}</Text>
        </View>
        <Text style={styles.fieldDescription}>{description}</Text>
      </View>
      <View style={styles.tagBox}>
        {value.map((item) => (
          <View style={styles.tag} key={item}>
            <Text style={styles.tagText}>{item}</Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`Remove ${item}`}
              hitSlop={8}
              onPress={() => onChange(value.filter((entry) => entry !== item))}
              style={styles.tagRemove}
            >
              <Ionicons name="close" size={14} color="#64816a" />
            </Pressable>
          </View>
        ))}
        <TextInput
          accessibilityLabel={label}
          autoCapitalize="words"
          onChangeText={setDraft}
          onSubmitEditing={addTag}
          placeholder={value.length ? 'Add another…' : placeholder}
          placeholderTextColor="#a1a398"
          returnKeyType="done"
          style={styles.tagInput}
          value={draft}
        />
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Add ${label.toLowerCase()}`}
          onPress={addTag}
          style={({ pressed }) => [styles.addButton, pressed && styles.pressed]}
        >
          <Ionicons name="add" size={20} color={colors.green} />
        </Pressable>
      </View>
    </View>
  );
}

function Header({ step, total }) {
  return (
    <View style={styles.topbar}>
      <View style={styles.wordmark} accessibilityLabel="nibble">
        <View style={styles.wordmarkMark}>
          <Ionicons name="restaurant-outline" size={18} color="#fff" />
        </View>
        <Text style={styles.wordmarkText}>nibble<Text style={styles.wordmarkPeriod}>.</Text></Text>
      </View>
      <View style={styles.stepIndicator}>
        <Text style={styles.stepCurrent}>{String(step + 1).padStart(2, '0')}</Text>
        <Text style={styles.stepTotal}>/ {String(total).padStart(2, '0')}</Text>
        <View style={styles.stepLine} />
        <Text style={styles.stepLabel}>YOUR FOOD</Text>
      </View>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Get help"
        onPress={() => Alert.alert('A quick note', 'Add any foods you need to avoid, and we’ll leave them out of your plan.')}
        style={({ pressed }) => [styles.helpButton, pressed && styles.pressed]}
      >
        <Ionicons name="help-circle-outline" size={20} color="#788075" />
      </Pressable>
    </View>
  );
}

function MealPreferencesScreen() {
  const insets = useSafeAreaInsets();
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [diet, setDiet] = useState('Everything');
  const [allergies, setAllergies] = useState([]);
  const [dislikes, setDislikes] = useState([]);
  const [selectedGoals, setSelectedGoals] = useState(['Save time']);
  const [weeklyHoursSaved, setWeeklyHoursSaved] = useState(3);
  const [healthFocus, setHealthFocus] = useState([]);
  const [weeklyBudget, setWeeklyBudget] = useState(100);
  const [selectedDietaryNeeds, setSelectedDietaryNeeds] = useState([]);
  const [units, setUnits] = useState('metric');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [gender, setGender] = useState('');
  const [activityLevel, setActivityLevel] = useState('');
  const [weightGoal, setWeightGoal] = useState('');
  const [calorieTarget, setCalorieTarget] = useState('');
  const [macroTargets, setMacroTargets] = useState({ protein: '', carbs: '', fat: '' });
  const [planMethod, setPlanMethod] = useState(planMethods[0].label);
  const [profileCreated, setProfileCreated] = useState(false);
  const [plannerPage, setPlannerPage] = useState('methods');
  const [mealDetail, setMealDetail] = useState(null);
  const [mealDetailReturnPage, setMealDetailReturnPage] = useState('browse');
  const [calendarReturnPage, setCalendarReturnPage] = useState('recommendations');
  const [selectedMood, setSelectedMood] = useState(moodOptions[1].label);
  const [selectedMeals, setSelectedMeals] = useState([]);
  const [weeklySchedule, setWeeklySchedule] = useState(() => Object.fromEntries(weekDays.map((day) => [day, []])));
  const [selectedMealToMove, setSelectedMealToMove] = useState(null);
  const [draggingMealKey, setDraggingMealKey] = useState(null);
  const [pantryPhotos, setPantryPhotos] = useState([]);
  const [pantryIngredients, setPantryIngredients] = useState([]);
  const [pantryIngredientDraft, setPantryIngredientDraft] = useState('');
  const [editingPantryIngredient, setEditingPantryIngredient] = useState(null);
  const [editingPantryDraft, setEditingPantryDraft] = useState('');
  const [saved, setSaved] = useState(false);
  const dayDropRefs = useRef({});

  function changeStep(nextStep) {
    Keyboard.dismiss();
    setStep(nextStep);
    setSaved(false);
  }

  function toggleGoal(goal) {
    setSelectedGoals((current) =>
      current.includes(goal) ? current.filter((item) => item !== goal) : [...current, goal],
    );
    setSaved(false);
  }

  function toggleHealthFocus(focus) {
    setHealthFocus((current) =>
      current.includes(focus) ? current.filter((item) => item !== focus) : [...current, focus],
    );
    setSaved(false);
  }

  function toggleDietaryNeed(need) {
    setSelectedDietaryNeeds((current) =>
      current.includes(need) ? current.filter((item) => item !== need) : [...current, need],
    );
    setSaved(false);
  }

  function changeUnits(nextUnits) {
    if (nextUnits === units) return;
    setUnits(nextUnits);
  }

  const healthDetails = [
    height && `${units === 'metric' ? Math.round(Number(height) * 10) / 10 : Math.round(Number(height) / 2.54)} ${units === 'metric' ? 'cm' : 'in'}`,
    weight && `${units === 'metric' ? Math.round(Number(weight) * 10) / 10 : Math.round(Number(weight) * 2.20462)} ${units === 'metric' ? 'kg' : 'lb'}`,
    gender,
    activityLevel && `${activityLevel.toLowerCase()} activity`,
  ].filter(Boolean);
  function savePreferences() {
    setSaved(true);
  }

  function openPlanMethod() {
    setSaved(false);
    if (planMethod === planMethods[0].label) setPlannerPage('mood');
    else if (planMethod === planMethods[1].label) setPlannerPage('browse');
    else setPlannerPage('pantry');
  }

  async function addPantryPhoto(source) {
    try {
      if (source === 'camera' && Platform.OS !== 'web') {
        const permission = await ImagePicker.requestCameraPermissionsAsync();
        if (!permission.granted) {
          Alert.alert('Camera access needed', 'Allow camera access to take a photo of your fridge or pantry.');
          return;
        }
      } else if (Platform.OS !== 'web') {
        const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permission.granted) {
          Alert.alert('Photo access needed', 'Allow photo access to add a picture of your ingredients.');
          return;
        }
      }

      const result = source === 'camera' && Platform.OS !== 'web'
        ? await ImagePicker.launchCameraAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 0.8 })
        : await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 0.8 });
      if (!result.canceled && result.assets?.length) {
        setPantryPhotos((current) => [...current, ...result.assets.map((asset) => asset.uri)]);
        setSaved(false);
      }
    } catch (error) {
      Alert.alert('Could not add photo', 'Please try taking or choosing the photo again.');
    }
  }

  function addPantryIngredient() {
    const ingredient = pantryIngredientDraft.trim();
    if (!ingredient || pantryIngredients.some((item) => item.toLowerCase() === ingredient.toLowerCase())) return;
    setPantryIngredients((current) => [...current, ingredient]);
    setPantryIngredientDraft('');
    setSaved(false);
  }

  function addNamedPantryIngredient(ingredient) {
    if (pantryIngredients.some((item) => item.toLowerCase() === ingredient.toLowerCase())) return;
    setPantryIngredients((current) => [...current, ingredient]);
    setSaved(false);
  }

  function savePantryIngredientEdit() {
    const ingredient = editingPantryDraft.trim();
    if (!editingPantryIngredient || !ingredient) return;
    setPantryIngredients((current) => current.map((item) => item === editingPantryIngredient ? ingredient : item));
    setEditingPantryIngredient(null);
    setEditingPantryDraft('');
    setSaved(false);
  }

  function toggleMeal(mealName) {
    setSelectedMeals((current) =>
      current.includes(mealName) ? current.filter((item) => item !== mealName) : [...current, mealName],
    );
    setSaved(false);
  }

  function startWeeklyCalendar(mealNames, returnPage) {
    const schedule = Object.fromEntries(weekDays.map((day) => [day, []]));
    mealNames.forEach((mealName, index) => {
      schedule[weekDays[index % weekDays.length]].push(mealName);
    });
    setWeeklySchedule(schedule);
    setSelectedMealToMove(null);
    setCalendarReturnPage(returnPage);
    setSaved(false);
    setPlannerPage('calendar');
  }

  function assignMealToDay(mealName, destination) {
    setWeeklySchedule((current) => {
      const next = Object.fromEntries(weekDays.map((day) => [
        day,
        (current[day] || []).filter((item) => item !== mealName),
      ]));
      next[destination] = [...next[destination], mealName];
      return next;
    });
    setSelectedMealToMove(null);
    setSaved(false);
  }

  function moveMealToDay(mealName, pageY) {
    Promise.all(weekDays.map((day) => new Promise((resolve) => {
      const node = dayDropRefs.current[day];
      if (!node?.measureInWindow) {
        resolve(null);
        return;
      }
      node.measureInWindow((x, y, width, height) => resolve({ day, top: y, bottom: y + height }));
    }))).then((measurements) => {
      const destination = measurements.find((bounds) => bounds && pageY >= bounds.top && pageY <= bounds.bottom);
      if (!destination) return;
      assignMealToDay(mealName, destination.day);
    });
  }

  function leavePlannerPage() {
    setPlannerPage(plannerPage === 'mealDetail' ? mealDetailReturnPage : plannerPage === 'calendar' ? calendarReturnPage : 'methods');
    setSaved(false);
  }

  function openMealDetail(meal, returnPage) {
    setMealDetail(meal);
    setMealDetailReturnPage(returnPage);
    setPlannerPage('mealDetail');
  }

  function addMealFromDetail() {
    if (!mealDetail) return;
    setSelectedMeals((current) => current.includes(mealDetail.name) ? current : [...current, mealDetail.name]);
    setSaved(false);
    setPlannerPage(mealDetailReturnPage);
  }

  function createProfile() {
    Keyboard.dismiss();
    setSaved(false);
    setProfileCreated(true);
  }

  const goalDetails = selectedGoals.map((goal) => {
    if (goal === 'Save time') return `save ${weeklyHoursSaved} hours/week`;
    if (goal === 'Healthier eating') return healthFocus.length
      ? `focus on ${healthFocus.join(', ').toLowerCase()}`
      : 'healthier everyday meals';
    return `$${weeklyBudget} weekly food budget`;
  });
  const goalSummary = goalDetails.length
    ? goalDetails.join('; ')
    : 'no meal goals';
  const dietarySummary = selectedDietaryNeeds.length
    ? `; dietary needs: ${selectedDietaryNeeds.join(', ').toLowerCase()}`
    : '';
  const healthSummary = healthDetails.length
    ? `; health info: ${healthDetails.join(', ').toLowerCase()}`
    : '';
  const nutritionTargets = [
    weightGoal && (weightGoal === 'No specific goal' ? 'no specific weight goal' : `${weightGoal.toLowerCase()} goal`),
    calorieTarget && `${calorieTarget} kcal/day`,
    ...macroFields
      .filter(({ key }) => macroTargets[key])
      .map(({ key, label }) => `${macroTargets[key]} g ${label.toLowerCase()}/day`),
  ].filter(Boolean);
  const targetSummary = nutritionTargets.length
    ? `; targets: ${nutritionTargets.join(', ')}`
    : '';
  const profileSummary = `${name.trim() ? `Lovely, ${name.trim()}!` : 'Lovely.'} We’ve saved your ${diet.toLowerCase()} preferences and ${goalSummary}${dietarySummary}${healthSummary}${targetSummary}.`;
  const mealsForProfile = mealCatalog.filter((meal) => {
    if (diet === 'Vegan' && !meal.vegan) return false;
    if (diet === 'Vegetarian' && !meal.vegetarian) return false;
    if (diet === 'Pescatarian' && !meal.vegetarian) return false;
    if (selectedDietaryNeeds.includes('Gluten-free') && !meal.glutenFree) return false;
    if (selectedDietaryNeeds.includes('Lactose intolerant') && !meal.lactoseFree) return false;
    const avoidTerms = [...allergies, ...dislikes].map((item) => item.trim().toLowerCase()).filter(Boolean);
    return !avoidTerms.some((term) => meal.ingredients.some((ingredient) => ingredient.includes(term)));
  });
  const recommendedMeals = mealsForProfile.filter((meal) => meal.moods.includes(selectedMood));
  const pantryMealIdeas = [...mealsForProfile]
    .map((meal) => ({
      meal,
      matches: pantryIngredients.filter((ingredient) => meal.ingredients.some((item) => item.includes(ingredient.toLowerCase()) || ingredient.toLowerCase().includes(item))).length,
    }))
    .sort((first, second) => second.matches - first.matches)
    .map(({ meal }) => meal);

  if (profileCreated) {
    return (
      <SafeAreaView style={styles.plannerSafeArea}>
        <StatusBar style="light" />
        <View style={styles.plannerScreen}>
          <View style={styles.plannerTopbar}>
            <View style={styles.plannerBrand}>
              <View style={styles.plannerBrandMark}>
                <Ionicons name="restaurant-outline" size={18} color="#24443a" />
              </View>
                <Text style={styles.plannerBrandText}>nibble<Text style={styles.plannerBrandPeriod}>.</Text></Text>
            </View>
            {plannerPage === 'methods' ? (
              <View style={styles.profileReadyBadge}>
                <Ionicons name="checkmark-circle" size={15} color="#a8da83" />
                <Text style={styles.profileReadyText}>PROFILE READY</Text>
              </View>
            ) : (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Back to plan options"
                onPress={leavePlannerPage}
                style={({ pressed }) => [styles.plannerBackButton, pressed && styles.pressed]}
              >
                <Ionicons name="arrow-back" size={16} color="#e8f2df" />
                <Text style={styles.plannerBackText}>{plannerPage === 'mealDetail' ? 'Meal ideas' : plannerPage === 'calendar' ? 'Meal ideas' : 'Plan options'}</Text>
              </Pressable>
            )}
          </View>

          <ScrollView
            contentContainerStyle={[styles.plannerContent, { paddingBottom: 28 + insets.bottom }]}
            showsVerticalScrollIndicator={false}
          >
            {plannerPage === 'methods' && (
              <>
                <View style={styles.plannerWelcome}>
                  <Text style={styles.plannerEyebrow}>YOUR KITCHEN</Text>
                  <Text style={styles.plannerTitle}>{name.trim() ? `Welcome, ${name.trim()}.` : 'Your kitchen is ready.'}</Text>
                  <Text style={styles.plannerSubtitle}>Your preferences are in. How should we fill your table?</Text>
                </View>

                <View style={styles.plannerSectionHeading}>
                  <View>
                    <Text style={styles.plannerSectionTitle}>Start with a plan</Text>
                    <Text style={styles.plannerSectionSubtitle}>Choose the way you want to cook this week.</Text>
                  </View>
                  <View style={styles.weekBadge}>
                    <Ionicons name="calendar-outline" size={15} color="#d5e8ca" />
                    <Text style={styles.weekBadgeText}>THIS WEEK</Text>
                  </View>
                </View>

                <View style={styles.plannerMethods}>
                  {planMethods.map(({ label, detail, icon }, index) => {
                    const selected = planMethod === label;
                    return (
                      <Pressable
                        accessibilityRole="radio"
                        accessibilityState={{ selected }}
                        key={label}
                        onPress={() => {
                          setPlanMethod(label);
                          setSaved(false);
                        }}
                        style={({ pressed }) => [
                          styles.plannerMethodCard,
                          selected && styles.plannerMethodCardSelected,
                          pressed && styles.pressed,
                        ]}
                      >
                        <View style={[styles.plannerMethodIconWrap, styles[`plannerMethodIconWrap${index + 1}`]]}>
                          <Text style={styles.plannerMethodIcon}>{icon}</Text>
                        </View>
                        <View style={styles.plannerMethodCopy}>
                          <Text style={[styles.plannerMethodTitle, selected && styles.plannerMethodTitleSelected]}>{label}</Text>
                          <Text style={styles.plannerMethodDetail}>{detail}</Text>
                        </View>
                        <View style={[styles.plannerRadio, selected && styles.plannerRadioSelected]}>
                          {selected && <View style={styles.plannerRadioDot} />}
                        </View>
                      </Pressable>
                    );
                  })}
                </View>
              </>
            )}

            {plannerPage === 'mood' && (
              <>
                <View style={styles.destinationIntro}>
                  <Text style={styles.plannerEyebrow}>A LITTLE INSPIRATION</Text>
                  <Text style={styles.destinationTitle}>What are you feeling?</Text>
                  <Text style={styles.destinationSubtitle}>Pick the kind of food that sounds good right now.</Text>
                </View>
                <View style={styles.moodGrid}>
                  {moodOptions.map(({ label, detail, emoji, color }) => {
                    const selected = selectedMood === label;
                    return (
                      <Pressable
                        accessibilityRole="radio"
                        accessibilityState={{ selected }}
                        key={label}
                        onPress={() => setSelectedMood(label)}
                        style={({ pressed }) => [styles.moodCard, selected && styles.moodCardSelected, pressed && styles.pressed]}
                      >
                        <View style={[styles.moodEmojiWrap, { backgroundColor: color }]}>
                          <Text style={styles.moodEmoji}>{emoji}</Text>
                        </View>
                        <Text style={styles.moodTitle}>{label}</Text>
                        <Text style={styles.moodDetail}>{detail}</Text>
                        {selected && <Ionicons name="checkmark-circle" size={19} color="#4d8b57" style={styles.moodCheck} />}
                      </Pressable>
                    );
                  })}
                </View>
              </>
            )}

            {plannerPage === 'recommendations' && (
              <>
                <View style={styles.destinationIntro}>
                  <Text style={styles.plannerEyebrow}>MADE FOR YOUR MOOD</Text>
                  <Text style={styles.destinationTitle}>{selectedMood} meal ideas</Text>
                  <Text style={styles.destinationSubtitle}>A few ideas that fit your preferences and today’s mood.</Text>
                </View>
                <View style={styles.mealList}>
                  {recommendedMeals.map((meal) => (
                    <Pressable key={meal.name} accessibilityRole="button" accessibilityLabel={`View ${meal.name}`} onPress={() => openMealDetail(meal, 'recommendations')} style={({ pressed }) => [styles.mealCard, pressed && styles.pressed]}>
                      <View style={styles.mealEmojiWrap}><Text style={styles.mealEmoji}>{meal.emoji}</Text></View>
                      <View style={styles.mealCardCopy}>
                        <Text style={styles.mealTitle}>{meal.name}</Text>
                        <Text style={styles.mealDetail}>{meal.detail}</Text>
                        <Text style={styles.mealMeta}>{meal.time}  ·  {meal.tags.join('  ·  ')}</Text>
                      </View>
                      <Ionicons name="chevron-forward" size={18} color="#f26b4f" />
                    </Pressable>
                  ))}
                  {recommendedMeals.length === 0 && (
                    <Text style={styles.emptyMeals}>No meals match that mood and your saved food restrictions. Try another mood.</Text>
                  )}
                </View>
              </>
            )}

            {plannerPage === 'browse' && (
              <>
                <View style={styles.destinationIntro}>
                  <Text style={styles.plannerEyebrow}>MEAL IDEAS</Text>
                  <Text style={styles.destinationTitle}>Choose your meals</Text>
                  <Text style={styles.destinationSubtitle}>Tap the dishes you’d like to add to your week.</Text>
                </View>
                <View style={styles.mealList}>
                  {mealsForProfile.map((meal) => {
                    const selected = selectedMeals.includes(meal.name);
                    return (
                      <Pressable
                        accessibilityRole="button"
                        key={meal.name}
                        onPress={() => openMealDetail(meal, 'browse')}
                        style={({ pressed }) => [styles.mealCard, selected && styles.mealCardSelected, pressed && styles.pressed]}
                      >
                        <View style={styles.mealEmojiWrap}><Text style={styles.mealEmoji}>{meal.emoji}</Text></View>
                        <View style={styles.mealCardCopy}>
                          <Text style={styles.mealTitle}>{meal.name}</Text>
                          <Text style={styles.mealDetail}>{meal.detail}</Text>
                          <Text style={styles.mealMeta}>{meal.time}  ·  {meal.tags.join('  ·  ')}</Text>
                        </View>
                        <View style={[styles.mealSelectMark, selected && styles.mealSelectMarkSelected]}>
                          {selected && <Ionicons name="checkmark" size={14} color="#fff" />}
                        </View>
                      </Pressable>
                    );
                  })}
                  {mealsForProfile.length === 0 && (
                    <Text style={styles.emptyMeals}>No meal ideas match your saved food restrictions yet.</Text>
                  )}
                </View>
              </>
            )}

            {plannerPage === 'mealDetail' && mealDetail && (
              <>
                <View style={styles.mealDetailHero}>
                  <View style={styles.mealDetailEmojiWrap}><Text style={styles.mealDetailEmoji}>{mealDetail.emoji}</Text></View>
                  <Text style={styles.plannerEyebrow}>MEAL IDEA</Text>
                  <Text style={styles.mealDetailTitle}>{mealDetail.name}</Text>
                  <Text style={styles.mealDetailSubtitle}>{mealDetail.detail}</Text>
                  <View style={styles.mealDetailMetaRow}>
                    <View style={styles.mealDetailMeta}><Ionicons name="time-outline" size={16} color="#d8523c" /><Text style={styles.mealDetailMetaText}>{mealDetail.time}</Text></View>
                    <View style={styles.mealDetailMeta}><Ionicons name="flame-outline" size={16} color="#d8523c" /><Text style={styles.mealDetailMetaText}>{mealDetail.calories} kcal</Text></View>
                  </View>
                </View>

                <View style={styles.nutritionCard}>
                  <View style={styles.detailSectionHeading}>
                    <Text style={styles.detailSectionTitle}>Nutrition per serving</Text>
                    <Text style={styles.detailSectionCaption}>estimated</Text>
                  </View>
                  <View style={styles.macroGrid}>
                    <View style={[styles.macroStat, styles.macroStatProtein]}><Text style={styles.macroStatValue}>{mealDetail.macros.protein}g</Text><Text style={styles.macroStatLabel}>Protein</Text></View>
                    <View style={[styles.macroStat, styles.macroStatCarbs]}><Text style={styles.macroStatValue}>{mealDetail.macros.carbs}g</Text><Text style={styles.macroStatLabel}>Carbs</Text></View>
                    <View style={[styles.macroStat, styles.macroStatFat]}><Text style={styles.macroStatValue}>{mealDetail.macros.fat}g</Text><Text style={styles.macroStatLabel}>Fat</Text></View>
                  </View>
                </View>

                <View style={styles.recipeSection}>
                  <Text style={styles.detailSectionTitle}>What you’ll need</Text>
                  <View style={styles.ingredientList}>
                    {mealDetail.ingredients.map((ingredient) => <View key={ingredient} style={styles.ingredientRow}><Ionicons name="checkmark-circle" size={16} color="#48a868" /><Text style={styles.ingredientText}>{ingredient}</Text></View>)}
                  </View>
                  <Text style={styles.detailSectionTitle}>How to make it</Text>
                  <View style={styles.recipeSteps}>
                    {mealDetail.recipe.map((step, index) => <View key={step} style={styles.recipeStep}><View style={styles.recipeStepNumber}><Text style={styles.recipeStepNumberText}>{index + 1}</Text></View><Text style={styles.recipeStepText}>{step}</Text></View>)}
                  </View>
                </View>
              </>
            )}

            {plannerPage === 'calendar' && (
              <>
                <View style={styles.destinationIntro}>
                  <Text style={styles.plannerEyebrow}>YOUR WEEK</Text>
                  <Text style={styles.destinationTitle}>Meals on the calendar</Text>
                  <Text style={styles.destinationSubtitle}>Drag a meal to another day to rearrange your week.</Text>
                </View>
                <View style={styles.calendarSummary}>
                  <Ionicons name="calendar-outline" size={19} color="#31564a" />
                  <Text style={styles.calendarSummaryText}>
                    {weekDays.reduce((total, day) => total + (weeklySchedule[day]?.length || 0), 0)} meals planned
                  </Text>
                  <Text style={styles.calendarSummaryMeta}>MON — SUN</Text>
                </View>
                {selectedMealToMove && (
                  <Text style={styles.calendarMoveHint}>
                    Moving {selectedMealToMove}. Choose a day or drag the meal there.
                  </Text>
                )}
                <View style={styles.weekCalendar}>
                  {weekDays.map((day, index) => {
                    const meals = weeklySchedule[day] || [];
                    return (
                      <View
                        testID={`calendar-day-${day.toLowerCase()}`}
                        key={day}
                        ref={(node) => {
                          dayDropRefs.current[day] = node;
                        }}
                        style={[
                          styles.calendarDay,
                          meals.length > 0 && styles.calendarDayFilled,
                          meals.includes(draggingMealKey) && styles.calendarDayDragging,
                        ]}
                      >
                        <View style={styles.calendarDayHeading}>
                          <View style={styles.calendarDayNameWrap}>
                            <Text style={styles.calendarDayIndex}>{String(index + 1).padStart(2, '0')}</Text>
                            <Text style={styles.calendarDayName}>{day}</Text>
                          </View>
                          {selectedMealToMove ? (
                            <Pressable
                              accessibilityRole="button"
                              accessibilityLabel={`Place selected meal on ${day}`}
                              onPress={() => assignMealToDay(selectedMealToMove, day)}
                              style={styles.calendarPlaceButton}
                            >
                              <Text style={styles.calendarPlaceButtonText}>Place here</Text>
                            </Pressable>
                          ) : (
                            <Text style={styles.calendarDayMealCount}>{meals.length ? `${meals.length} planned` : 'Open'}</Text>
                          )}
                        </View>
                        <View style={[styles.calendarDropZone, meals.length === 0 && styles.calendarDropZoneEmpty]}>
                          {meals.length > 0 ? meals.map((mealName) => {
                            const meal = mealCatalog.find((item) => item.name === mealName);
                            if (!meal) return null;
                            return (
                              <View key={mealName} style={styles.calendarScheduledRow}>
                                <DraggableMealCard
                                  meal={meal}
                                  onDrop={(pageY) => moveMealToDay(mealName, pageY)}
                                  onOpen={() => openMealDetail(meal, 'calendar')}
                                  onDragStart={() => setDraggingMealKey(mealName)}
                                  onDragEnd={() => setDraggingMealKey(null)}
                                  onSelectMove={() => setSelectedMealToMove((current) => current === mealName ? null : mealName)}
                                  selectedForMove={selectedMealToMove === mealName}
                                />
                              </View>
                            );
                          }) : (
                            <View style={styles.calendarPlaceholderCard}>
                              <Text style={styles.calendarPlaceholderEmoji}>{dayPlaceholders[index].emoji}</Text>
                              <View style={styles.calendarPlaceholderCopy}>
                                <Text style={styles.calendarPlaceholderTitle}>{dayPlaceholders[index].title}</Text>
                                <Text style={styles.calendarPlaceholderHint}>{dayPlaceholders[index].hint} · drop a meal here</Text>
                              </View>
                            </View>
                          )}
                        </View>
                      </View>
                    );
                  })}
                </View>
              </>
            )}

            {plannerPage === 'pantry' && (
              <>
                <View style={styles.destinationIntro}>
                  <Text style={styles.plannerEyebrow}>COOK WITH WHAT YOU HAVE</Text>
                  <Text style={styles.destinationTitle}>Show us your kitchen</Text>
                  <Text style={styles.destinationSubtitle}>Take a photo of your fridge and pantry. We’ll look for ingredients to build meals around.</Text>
                </View>
                <View style={styles.fridgeScene}>
                  <View style={styles.tocaFridge} accessibilityElementsHidden>
                    <View style={[styles.openFridgeDoorGraphic, styles.leftFridgeDoor]}>
                      <View style={[styles.fridgeDoorHinge, styles.leftDoorHinge]} />
                      {[0, 1, 2].map((shelfIndex) => <View key={`left-door-${shelfIndex}`} style={styles.doorShelf}>{pantryIngredients.slice(shelfIndex + 12, shelfIndex + 13).map((ingredient) => <FridgeIngredientItem key={ingredient} ingredient={ingredient} onPress={() => addNamedPantryIngredient(ingredient)} />)}</View>)}
                    </View>
                    <View style={styles.fridgeCabinet}>
                      <View style={styles.fridgeFreezerGraphic}>
                        <View style={styles.fridgeBin}>{pantryIngredients.slice(0, 3).map((ingredient) => <FridgeIngredientItem key={ingredient} ingredient={ingredient} onPress={() => addNamedPantryIngredient(ingredient)} />)}</View>
                      </View>
                        <View style={styles.fridgeShelfGraphic}>
                        {pantryIngredients.slice(3, 6).map((ingredient) => <FridgeIngredientItem key={ingredient} ingredient={ingredient} onPress={() => addNamedPantryIngredient(ingredient)} />)}
                      </View>
                      <View style={styles.fridgeShelfGraphic}>
                        {pantryIngredients.slice(6, 9).map((ingredient) => <FridgeIngredientItem key={ingredient} ingredient={ingredient} onPress={() => addNamedPantryIngredient(ingredient)} />)}
                      </View>
                      <View style={styles.fridgeShelfGraphic}>
                        {pantryIngredients.slice(9, 12).map((ingredient) => <FridgeIngredientItem key={ingredient} ingredient={ingredient} onPress={() => addNamedPantryIngredient(ingredient)} />)}
                      </View>
                      <View style={styles.fridgeCrisperGraphic}><Text style={styles.fridgeCrisperText}>FRESH</Text></View>
                    </View>
                    <View style={[styles.openFridgeDoorGraphic, styles.rightFridgeDoor]}>
                      <View style={[styles.fridgeDoorHinge, styles.rightDoorHinge]} />
                      {[0, 1, 2].map((shelfIndex) => <View key={`right-door-${shelfIndex}`} style={styles.doorShelf}>{pantryIngredients.slice(shelfIndex + 15, shelfIndex + 16).map((ingredient) => <FridgeIngredientItem key={ingredient} ingredient={ingredient} onPress={() => addNamedPantryIngredient(ingredient)} />)}</View>)}
                    </View>
                  </View>
                  <View style={styles.fridgePhotoSlot}>
                    <Text style={styles.fridgePhotoSlotTitle}>{pantryPhotos.length ? `${pantryPhotos.length} photo${pantryPhotos.length === 1 ? '' : 's'} added` : 'Add a fridge or pantry photo'}</Text>
                    <Pressable
                      accessibilityRole="button"
                      onPress={() => addPantryPhoto('camera')}
                      style={({ pressed }) => [styles.fridgePhotoButton, pressed && styles.pressed]}
                    >
                      <Ionicons name={Platform.OS === 'web' ? 'image-outline' : 'camera-outline'} size={16} color="#fff" />
                      <Text style={styles.fridgePhotoButtonText}>{Platform.OS === 'web' ? 'Take or upload' : 'Take a photo'}</Text>
                    </Pressable>
                    {Platform.OS !== 'web' && (
                      <Pressable accessibilityRole="button" onPress={() => addPantryPhoto('library')} style={styles.fridgeLibraryButton}>
                        <Text style={styles.fridgeLibraryButtonText}>Choose from library</Text>
                      </Pressable>
                    )}
                  </View>
                </View>
                <View style={styles.manualIngredientsCard}>
                  <View style={styles.manualIngredientsHeading}>
                    <View>
                      <Text style={styles.manualIngredientsTitle}>Add ingredients manually</Text>
                      <Text style={styles.manualIngredientsSubtitle}>Add anything the photo might miss.</Text>
                    </View>
                    <Ionicons name="create-outline" size={20} color="#4b8dcc" />
                  </View>
                  <View style={styles.manualIngredientInputRow}>
                    <TextInput
                      accessibilityLabel="Ingredient name"
                      onChangeText={setPantryIngredientDraft}
                      onSubmitEditing={addPantryIngredient}
                      placeholder="e.g. eggs, spinach"
                      placeholderTextColor="#91a0a4"
                      returnKeyType="done"
                      style={styles.manualIngredientInput}
                      value={pantryIngredientDraft}
                    />
                    <Pressable accessibilityRole="button" accessibilityLabel="Add ingredient" onPress={addPantryIngredient} style={styles.manualIngredientAddButton}>
                      <Ionicons name="add" size={19} color="#fff" />
                    </Pressable>
                  </View>
                  {pantryIngredients.length > 0 && (
                    <View style={styles.manualIngredientList}>
                      {pantryIngredients.map((ingredient) => (
                        <View key={ingredient} style={styles.manualIngredientRow}>
                          {editingPantryIngredient === ingredient ? (
                            <TextInput
                              accessibilityLabel={`Edit ${ingredient}`}
                              autoFocus
                              onChangeText={setEditingPantryDraft}
                              onSubmitEditing={savePantryIngredientEdit}
                              style={styles.manualIngredientEditInput}
                              value={editingPantryDraft}
                            />
                          ) : (
                            <Text style={styles.manualIngredientText}>{ingredient}</Text>
                          )}
                          <Pressable
                            accessibilityRole="button"
                            accessibilityLabel={`Edit ${ingredient}`}
                            onPress={() => {
                              setEditingPantryIngredient(ingredient);
                              setEditingPantryDraft(ingredient);
                            }}
                            style={styles.manualIngredientIconButton}
                          >
                            <Ionicons name={editingPantryIngredient === ingredient ? 'checkmark' : 'pencil-outline'} size={16} color="#4b8dcc" />
                          </Pressable>
                          <Pressable
                            accessibilityRole="button"
                            accessibilityLabel={`Remove ${ingredient}`}
                            onPress={() => setPantryIngredients((current) => current.filter((item) => item !== ingredient))}
                            style={styles.manualIngredientIconButton}
                          >
                            <Ionicons name="trash-outline" size={16} color="#d9685b" />
                          </Pressable>
                        </View>
                      ))}
                    </View>
                  )}
                </View>
                {pantryPhotos.length > 0 && (
                  <View style={styles.photoGrid}>
                    {pantryPhotos.map((uri, index) => (
                      <View key={`${uri}-${index}`} style={styles.photoThumbWrap}>
                        <Image source={{ uri }} style={styles.photoThumb} />
                        <Pressable
                          accessibilityRole="button"
                          accessibilityLabel={`Remove kitchen photo ${index + 1}`}
                          onPress={() => {
                            setPantryPhotos((current) => current.filter((_, itemIndex) => itemIndex !== index));
                            setSaved(false);
                          }}
                          style={styles.photoRemove}
                        >
                          <Ionicons name="close" size={14} color="#fff" />
                        </Pressable>
                      </View>
                    ))}
                  </View>
                )}
              </>
            )}

            {plannerPage === 'pantryMeals' && (
              <>
                <View style={styles.destinationIntro}>
                  <Text style={styles.plannerEyebrow}>FROM YOUR KITCHEN</Text>
                  <Text style={styles.destinationTitle}>Here’s what you could make</Text>
                  <Text style={styles.destinationSubtitle}>
                    {pantryIngredients.length ? `We found ideas that use ${pantryIngredients.join(', ').toLowerCase()}.` : 'A few flexible ideas to help you use what you have.'}
                  </Text>
                </View>
                <View style={styles.pantryIdeaSummary}>
                  <Ionicons name="sparkles-outline" size={19} color="#d8523c" />
                  <Text style={styles.pantryIdeaSummaryText}>{pantryIngredients.length} ingredients added · {pantryMealIdeas.length} meal ideas</Text>
                </View>
                <View style={styles.mealList}>
                  {pantryMealIdeas.map((meal) => (
                    <Pressable key={meal.name} accessibilityRole="button" accessibilityLabel={`View ${meal.name}`} onPress={() => openMealDetail(meal, 'pantryMeals')} style={({ pressed }) => [styles.mealCard, pressed && styles.pressed]}>
                      <View style={styles.mealEmojiWrap}><Text style={styles.mealEmoji}>{meal.emoji}</Text></View>
                      <View style={styles.mealCardCopy}>
                        <Text style={styles.mealTitle}>{meal.name}</Text>
                        <Text style={styles.mealDetail}>{meal.detail}</Text>
                        <Text style={styles.mealMeta}>{meal.time}  ·  {meal.tags.join('  ·  ')}</Text>
                      </View>
                      <Ionicons name="chevron-forward" size={18} color="#f26b4f" />
                    </Pressable>
                  ))}
                </View>
              </>
            )}

            {saved && (
              <View style={styles.plannerConfirmation} accessibilityLiveRegion="polite">
                <Ionicons name="checkmark-circle" size={19} color="#8bc06b" />
                <Text style={styles.plannerConfirmationText}>
                  {plannerPage === 'calendar'
                    ? `Weekly plan saved with ${weekDays.reduce((total, day) => total + (weeklySchedule[day]?.length || 0), 0)} meals.`
                    : plannerPage === 'recommendations'
                    ? `Meal ideas saved for ${selectedMood.toLowerCase()}.`
                    : plannerPage === 'browse'
                      ? `${selectedMeals.length} meal${selectedMeals.length === 1 ? '' : 's'} added to your week.`
                      : `${pantryPhotos.length} photo${pantryPhotos.length === 1 ? '' : 's'} and ${pantryIngredients.length} manual ingredient${pantryIngredients.length === 1 ? '' : 's'} ready for your ingredient-based plan.`}
                </Text>
              </View>
            )}
          </ScrollView>

          <View style={[styles.plannerFooter, { paddingBottom: Math.max(insets.bottom, 14) }]}>
            <Text style={styles.plannerFooterNote}>
              {plannerPage === 'methods'
                ? 'You can change this any time.'
                : plannerPage === 'mood'
                  ? 'Choose one to see meal ideas.'
                  : plannerPage === 'recommendations'
                      ? 'Suggestions respect your saved food preferences.'
                    : plannerPage === 'browse'
                      ? `${selectedMeals.length} selected`
                        : plannerPage === 'mealDetail'
                                  ? 'Tap below to add this meal to your week.'
                                : plannerPage === 'calendar'
                          ? 'Drag meals between days to rearrange.'
                                        : plannerPage === 'pantryMeals'
                                          ? `${pantryMealIdeas.length} meal ideas ready`
                      : `${pantryPhotos.length} photo${pantryPhotos.length === 1 ? '' : 's'} · ${pantryIngredients.length} ingredient${pantryIngredients.length === 1 ? '' : 's'} added`}
            </Text>
            <Pressable
              accessibilityRole="button"
              disabled={
                (plannerPage === 'browse' && selectedMeals.length === 0)
                || (plannerPage === 'recommendations' && recommendedMeals.length === 0)
                || (plannerPage === 'pantry' && pantryPhotos.length === 0 && pantryIngredients.length === 0)
              }
              onPress={() => {
                if (plannerPage === 'methods') openPlanMethod();
                else if (plannerPage === 'mood') setPlannerPage('recommendations');
                else if (plannerPage === 'recommendations') startWeeklyCalendar(recommendedMeals.map((meal) => meal.name), 'recommendations');
                else if (plannerPage === 'browse') startWeeklyCalendar(selectedMeals, 'browse');
                else if (plannerPage === 'mealDetail') addMealFromDetail();
                else if (plannerPage === 'pantry') setPlannerPage('pantryMeals');
                else if (plannerPage === 'pantryMeals') startWeeklyCalendar(pantryMealIdeas.map((meal) => meal.name), 'pantryMeals');
                else savePreferences();
              }}
              style={({ pressed }) => [
                styles.plannerAction,
                saved && styles.plannerActionSaved,
                ((plannerPage === 'browse' && selectedMeals.length === 0)
                  || (plannerPage === 'recommendations' && recommendedMeals.length === 0)
                  || (plannerPage === 'pantry' && pantryPhotos.length === 0 && pantryIngredients.length === 0)) && styles.plannerActionDisabled,
                pressed && styles.pressed,
              ]}
            >
              <Text style={styles.plannerActionText}>
                {plannerPage === 'methods'
                  ? 'Build my plan'
                  : plannerPage === 'mood'
                    ? 'Find meals'
                    : plannerPage === 'recommendations'
                      ? 'Add meals to my week'
                      : plannerPage === 'browse'
                        ? 'Place selected meals'
                        : plannerPage === 'mealDetail'
                              ? 'Add this meal'
                            : plannerPage === 'calendar'
                          ? (saved ? 'Week saved' : 'Save weekly plan')
                              : plannerPage === 'pantryMeals'
                                ? 'Plan these meals'
                          : (saved ? 'Ingredients ready' : 'Find meals with these')}
              </Text>
              <Ionicons name={saved ? 'checkmark' : 'arrow-forward'} size={18} color="#24443a" />
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <StatusBar style="dark" />
      <View style={styles.screen}>
        <Header step={step} total={questionTitles.length} />
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.body}
        >
          <ScrollView
            key={step}
            contentContainerStyle={[styles.scrollContent, { paddingBottom: 30 + insets.bottom }]}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.formIntro}>
              <Text style={styles.formKicker}>QUESTION {String(step + 1).padStart(2, '0')} OF {String(questionTitles.length).padStart(2, '0')}</Text>
              <Text style={styles.title}>{questionTitles[step]}</Text>
              <Text style={styles.introDescription}>{questionDescriptions[step]}</Text>
              <View style={styles.kitchenArt} accessibilityElementsHidden>
                <View style={styles.stickerRow}>
                  {kitchenStickers[step].foods.map((food, index) => (
                    <View
                      key={food}
                      style={[styles.ingredientSticker, styles[`ingredientSticker${index + 1}`]]}
                    >
                      <Text style={styles.ingredientEmoji}>{food}</Text>
                    </View>
                  ))}
                </View>
                <View style={styles.artCopy}>
                  <Text style={styles.artKicker}>TODAY’S PREP CREW</Text>
                  <Text style={styles.artCaption}>{kitchenStickers[step].caption}</Text>
                </View>
                <Ionicons name="star" size={18} color={colors.tomato} />
              </View>
            </View>

            {step === 0 && (
              <View style={styles.fieldGroup}>
                <SectionHeading number="01" title="Your name" description="Optional" />
                <View style={styles.targetInputRow}>
                  <TextInput
                    accessibilityLabel="Your name"
                    autoCapitalize="words"
                    onChangeText={(value) => {
                      setName(value);
                      setSaved(false);
                    }}
                    onSubmitEditing={() => changeStep(step + 1)}
                    placeholder="e.g. Alex"
                    placeholderTextColor="#a1a398"
                    returnKeyType="next"
                    style={styles.targetInput}
                    value={name}
                  />
                </View>
                <Text style={styles.targetNote}>You can skip this and add it later.</Text>
              </View>
            )}

            {step === 1 && (
              <View style={styles.fieldGroup}>
                <SectionHeading number="02" title="Your style" description="Choose one" />
                <View style={styles.dietOptions}>
                  {diets.map(({ label, detail }) => {
                    const selected = diet === label;
                    return (
                      <Pressable
                        accessibilityRole="radio"
                        accessibilityState={{ selected }}
                        key={label}
                        onPress={() => {
                          setDiet(label);
                          setSaved(false);
                        }}
                        style={({ pressed }) => [
                          styles.dietOption,
                          selected && styles.dietOptionSelected,
                          pressed && styles.pressed,
                        ]}
                      >
                        <View style={[styles.radioMark, selected && styles.radioMarkSelected]}>
                          {selected && <View style={styles.radioDot} />}
                        </View>
                        <View style={styles.dietCopy}>
                          <Text style={styles.dietName}>{label}</Text>
                          <Text style={styles.dietDetail}>{detail}</Text>
                        </View>
                        {selected && <Ionicons name="checkmark" size={17} color={colors.green} />}
                      </Pressable>
                    );
                  })}
                </View>
              </View>
            )}

            {step === 2 && (
              <View style={styles.combinedRestrictions}>
                <TagInput
                  description="We’ll leave these out, always"
                  label="Any allergies?"
                  number="03"
                  onChange={(items) => {
                    setAllergies(items);
                    setSaved(false);
                  }}
                  placeholder="e.g. peanuts, shellfish"
                  value={allergies}
                />
                <TagInput
                  description="No hard feelings"
                  label="Anything you don’t like?"
                  number="04"
                  onChange={(items) => {
                    setDislikes(items);
                    setSaved(false);
                  }}
                  placeholder="e.g. cilantro, olives"
                  value={dislikes}
                />
                <View style={styles.restrictionsGroup}>
                  <SectionHeading number="05" title="Dietary needs" description="Select all that apply" />
                  <View style={styles.goalOptions}>
                    {dietaryNeeds.map(({ label, icon }) => {
                      const selected = selectedDietaryNeeds.includes(label);
                      return (
                        <Pressable
                          accessibilityRole="checkbox"
                          accessibilityState={{ checked: selected }}
                          key={label}
                          onPress={() => toggleDietaryNeed(label)}
                          style={({ pressed }) => [
                            styles.dietaryNeedOption,
                            selected && styles.dietaryNeedOptionSelected,
                            pressed && styles.pressed,
                          ]}
                        >
                          <Text style={styles.dietaryNeedIcon}>{icon}</Text>
                          <View style={styles.dietaryNeedCopy}>
                            <Text style={styles.dietaryNeedTitle}>{label}</Text>
                          </View>
                          <View style={[styles.checkboxMark, selected && styles.checkboxMarkSelected]}>
                            {selected && <Ionicons name="checkmark" size={12} color="#fff" />}
                          </View>
                        </Pressable>
                      );
                    })}
                  </View>
                </View>
              </View>
            )}

            {step === 3 && (
              <View style={[styles.fieldGroup, styles.goalsGroup]}>
                <SectionHeading number="06" title="Your goals" description="Pick all that fit" />
                <View style={styles.goalOptions}>
                  {goals.map((goal) => {
                    const selected = selectedGoals.includes(goal);
                    return (
                      <View key={goal} style={styles.goalItem}>
                        <Pressable
                          accessibilityRole="checkbox"
                          accessibilityState={{ checked: selected }}
                          onPress={() => toggleGoal(goal)}
                          style={({ pressed }) => [
                            styles.goalOption,
                            selected && styles.goalOptionSelected,
                            pressed && styles.pressed,
                          ]}
                        >
                          <View style={[styles.checkboxMark, selected && styles.checkboxMarkSelected]}>
                            {selected && <Ionicons name="checkmark" size={12} color="#fff" />}
                          </View>
                          <Text style={[styles.goalText, selected && styles.goalTextSelected]}>{goal}</Text>
                          <Ionicons
                            name={selected ? 'chevron-up' : 'chevron-down'}
                            size={16}
                            color={selected ? colors.green : colors.muted}
                            style={styles.goalChevron}
                          />
                        </Pressable>

                        {selected && goal === 'Save time' && (
                          <View style={styles.goalDetailCard}>
                            <Text style={styles.detailPrompt}>How much time would you like back?</Text>
                            <NumberStepper
                              label="Time to save each week"
                              value={weeklyHoursSaved}
                              unit="hrs / week"
                              onChange={(value) => {
                                setWeeklyHoursSaved(value);
                                setSaved(false);
                              }}
                              minimum={1}
                              maximum={14}
                            />
                          </View>
                        )}

                        {selected && goal === 'Healthier eating' && (
                          <View style={styles.goalDetailCard}>
                            <Text style={styles.detailPrompt}>What would you like more of?</Text>
                            <View style={styles.focusOptions}>
                              {['More vegetables', 'More protein', 'Less sugar', 'Balanced meals'].map((focus) => {
                                const focusSelected = healthFocus.includes(focus);
                                return (
                                  <Pressable
                                    accessibilityRole="checkbox"
                                    accessibilityState={{ checked: focusSelected }}
                                    key={focus}
                                    onPress={() => toggleHealthFocus(focus)}
                                    style={({ pressed }) => [
                                      styles.focusOption,
                                      focusSelected && styles.focusOptionSelected,
                                      pressed && styles.pressed,
                                    ]}
                                  >
                                    <Text style={[styles.focusText, focusSelected && styles.focusTextSelected]}>{focus}</Text>
                                    {focusSelected && <Ionicons name="checkmark" size={14} color={colors.green} />}
                                  </Pressable>
                                );
                              })}
                            </View>
                          </View>
                        )}

                        {selected && goal === 'Lower grocery costs' && (
                          <View style={styles.goalDetailCard}>
                            <Text style={styles.detailPrompt}>Set a weekly grocery budget</Text>
                            <View style={styles.budgetOptions}>
                              {[50, 75, 100, 150].map((amount) => {
                                const budgetSelected = weeklyBudget === amount;
                                return (
                                  <Pressable
                                    accessibilityRole="radio"
                                    accessibilityState={{ selected: budgetSelected }}
                                    key={amount}
                                    onPress={() => {
                                      setWeeklyBudget(amount);
                                      setSaved(false);
                                    }}
                                    style={({ pressed }) => [
                                      styles.budgetOption,
                                      budgetSelected && styles.budgetOptionSelected,
                                      pressed && styles.pressed,
                                    ]}
                                  >
                                    <Text style={[styles.budgetText, budgetSelected && styles.budgetTextSelected]}>
                                      ${amount}
                                    </Text>
                                  </Pressable>
                                );
                              })}
                            </View>
                            <Text style={styles.budgetCaption}>per week for groceries</Text>
                          </View>
                        )}
                      </View>
                    );
                  })}
                </View>
              </View>
            )}

            {step === 4 && (
              <View style={[styles.fieldGroup, styles.healthGroup]}>
                <SectionHeading number="07" title="Health info" description="All optional" />

                <View style={styles.unitSwitch} accessibilityRole="radiogroup">
                  {[
                    { value: 'metric', label: 'Metric · cm / kg' },
                    { value: 'imperial', label: 'Imperial · in / lb' },
                  ].map(({ value, label }) => {
                    const selected = units === value;
                    return (
                      <Pressable
                        accessibilityRole="radio"
                        accessibilityState={{ selected }}
                        key={value}
                        onPress={() => changeUnits(value)}
                        style={[styles.unitChoice, selected && styles.unitChoiceSelected]}
                      >
                        <Text style={[styles.unitChoiceText, selected && styles.unitChoiceTextSelected]}>{label}</Text>
                      </Pressable>
                    );
                  })}
                </View>

                <View style={styles.measurementsRow}>
                  <View style={styles.measurementField}>
                    <Text style={styles.measurementLabel}>Height</Text>
                    <View style={styles.measurementInputRow}>
                      <TextInput
                        accessibilityLabel={`Height in ${units === 'metric' ? 'centimeters' : 'inches'}`}
                        keyboardType="decimal-pad"
                        onChangeText={(value) => {
                          const numericValue = value.replace(/[^0-9.]/g, '');
                          setHeight(numericValue && units === 'imperial'
                            ? String(Number(numericValue) * 2.54)
                            : numericValue);
                          setSaved(false);
                        }}
                        placeholder={units === 'metric' ? '170' : '67'}
                        placeholderTextColor="#a1a398"
                        style={styles.measurementInput}
                        value={height
                          ? units === 'metric' ? height : String(Math.round(Number(height) / 2.54))
                          : ''}
                      />
                      <Text style={styles.measurementUnit}>{units === 'metric' ? 'cm' : 'in'}</Text>
                    </View>
                  </View>
                  <View style={styles.measurementField}>
                    <Text style={styles.measurementLabel}>Weight</Text>
                    <View style={styles.measurementInputRow}>
                      <TextInput
                        accessibilityLabel={`Weight in ${units === 'metric' ? 'kilograms' : 'pounds'}`}
                        keyboardType="decimal-pad"
                        onChangeText={(value) => {
                          const numericValue = value.replace(/[^0-9.]/g, '');
                          setWeight(numericValue && units === 'imperial'
                            ? String(Number(numericValue) / 2.20462)
                            : numericValue);
                          setSaved(false);
                        }}
                        placeholder={units === 'metric' ? '65' : '143'}
                        placeholderTextColor="#a1a398"
                        style={styles.measurementInput}
                        value={weight
                          ? units === 'metric' ? weight : String(Math.round(Number(weight) * 2.20462))
                          : ''}
                      />
                      <Text style={styles.measurementUnit}>{units === 'metric' ? 'kg' : 'lb'}</Text>
                    </View>
                  </View>
                </View>

                <View style={styles.healthQuestionGroup}>
                  <Text style={styles.detailPrompt}>Gender <Text style={styles.optionalLabel}>· optional</Text></Text>
                  <View style={styles.healthChoiceGrid}>
                    {genders.map((option) => {
                      const selected = gender === option;
                      return (
                        <Pressable
                          accessibilityRole="radio"
                          accessibilityState={{ selected }}
                          key={option}
                          onPress={() => {
                            setGender(option);
                            setSaved(false);
                          }}
                          style={[styles.healthChoice, selected && styles.healthChoiceSelected]}
                        >
                          <Text style={[styles.healthChoiceText, selected && styles.healthChoiceTextSelected]}>
                            {option}
                          </Text>
                        </Pressable>
                      );
                    })}
                  </View>
                </View>

                <View style={styles.healthQuestionGroup}>
                  <Text style={styles.detailPrompt}>How active are you most weeks? <Text style={styles.optionalLabel}>· optional</Text></Text>
                  <View style={styles.activityOptions}>
                    {activityLevels.map((option) => {
                      const selected = activityLevel === option;
                      return (
                        <Pressable
                          accessibilityRole="radio"
                          accessibilityState={{ selected }}
                          key={option}
                          onPress={() => {
                            setActivityLevel(option);
                            setSaved(false);
                          }}
                          style={[styles.activityOption, selected && styles.activityOptionSelected]}
                        >
                          <View style={[styles.radioMark, selected && styles.radioMarkSelected]}>
                            {selected && <View style={styles.radioDot} />}
                          </View>
                          <Text style={[styles.healthChoiceText, selected && styles.healthChoiceTextSelected]}>
                            {option}
                          </Text>
                        </Pressable>
                      );
                    })}
                  </View>
                </View>
              </View>
            )}

            {step === 5 && (
              <View style={[styles.fieldGroup, styles.healthGroup]}>
                <SectionHeading number="08" title="Weight goal" description="Optional · choose one" />
                <View style={styles.healthChoiceGrid}>
                  {weightGoals.map((option) => {
                    const selected = weightGoal === option;
                    return (
                      <Pressable
                        accessibilityRole="radio"
                        accessibilityState={{ selected }}
                        key={option}
                        onPress={() => {
                          setWeightGoal(option);
                          setSaved(false);
                        }}
                        style={[styles.healthChoice, selected && styles.healthChoiceSelected]}
                      >
                        <Text style={[styles.healthChoiceText, selected && styles.healthChoiceTextSelected]}>
                          {option}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>

                <View style={styles.targetSection}>
                  <Text style={styles.detailPrompt}>Daily calorie target <Text style={styles.optionalLabel}>· optional</Text></Text>
                  <View style={styles.targetInputRow}>
                    <TextInput
                      accessibilityLabel="Daily calorie target"
                      keyboardType="number-pad"
                      onChangeText={(value) => {
                        setCalorieTarget(value.replace(/[^0-9]/g, ''));
                        setSaved(false);
                      }}
                      placeholder="e.g. 2000"
                      placeholderTextColor="#a1a398"
                      style={styles.targetInput}
                      value={calorieTarget}
                    />
                    <Text style={styles.targetUnit}>kcal / day</Text>
                  </View>
                </View>

                <View style={styles.targetSection}>
                  <Text style={styles.detailPrompt}>Daily macro targets <Text style={styles.optionalLabel}>· optional</Text></Text>
                  <View style={styles.macroTargetsRow}>
                    {macroFields.map(({ key, label }) => (
                      <View key={key} style={styles.macroTargetField}>
                        <Text style={styles.measurementLabel}>{label}</Text>
                        <View style={styles.macroInputRow}>
                          <TextInput
                            accessibilityLabel={`${label} target in grams per day`}
                            keyboardType="number-pad"
                            onChangeText={(value) => {
                              setMacroTargets((current) => ({
                                ...current,
                                [key]: value.replace(/[^0-9]/g, ''),
                              }));
                              setSaved(false);
                            }}
                            placeholder="0"
                            placeholderTextColor="#a1a398"
                            style={styles.macroInput}
                            value={macroTargets[key]}
                          />
                          <Text style={styles.macroUnit}>g</Text>
                        </View>
                      </View>
                    ))}
                  </View>
                </View>

                <Text style={styles.targetNote}>Targets are optional. Enter values from your own plan.</Text>
              </View>
            )}

            {saved && (
              <View accessibilityLiveRegion="polite" style={styles.successMessage}>
                <Text style={styles.successText}>
                  {profileSummary}
                </Text>
              </View>
            )}
          </ScrollView>

          <View style={[styles.bottomBar, { paddingBottom: Math.max(insets.bottom, 12) }]}>
            {step > 0 ? (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Go back"
                onPress={() => changeStep(step - 1)}
                style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}
              >
                <Ionicons name="arrow-back" size={18} color={colors.green} />
                <Text style={styles.backButtonText}>Back</Text>
              </Pressable>
            ) : (
              <Text style={styles.requiredNote}>You can change these later.</Text>
            )}
            <Pressable
              accessibilityRole="button"
              onPress={() => {
                if (step === questionTitles.length - 1) createProfile();
                else changeStep(step + 1);
              }}
              style={({ pressed }) => [styles.continueButton, pressed && styles.continueButtonPressed]}
            >
              <Text style={styles.continueButtonText}>
                {step === questionTitles.length - 1 ? 'Create profile' : 'Continue'}
              </Text>
              <Ionicons name="arrow-forward" size={18} color="#fff" />
            </Pressable>
          </View>
        </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <MealPreferencesScreen />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  plannerSafeArea: {
    flex: 1,
    backgroundColor: '#edf2e9',
  },
  plannerScreen: {
    flex: 1,
    backgroundColor: '#fff5d9',
  },
  plannerTopbar: {
    minHeight: 68,
    paddingHorizontal: 22,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#24443a',
    backgroundColor: '#f26b4f',
  },
  plannerBrand: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  plannerBrandMark: {
    width: 31,
    height: 31,
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 11,
    backgroundColor: '#d5e8ca',
    backgroundColor: '#ffd45c',
  },
  plannerBrandText: {
    color: '#fffdf6',
      color: '#24324a',
    fontSize: 20,
    fontWeight: '800',
  },
  plannerBrandPeriod: {
    color: '#f06a52',
  },
  profileReadyBadge: {
    minHeight: 29,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: '#527267',
    borderRadius: 15,
    backgroundColor: '#31564a',
  },
  profileReadyText: {
    color: '#e8f2df',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  plannerContent: {
    width: '100%',
    maxWidth: 760,
    alignSelf: 'center',
    paddingHorizontal: 22,
    paddingTop: 25,
  },
  plannerWelcome: {
    padding: 22,
    borderRadius: 21,
    backgroundColor: '#31564a',
  },
  plannerEyebrow: {
    color: '#c2dbb1',
      color: '#fff1c2',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1.2,
  },
  plannerTitle: {
    marginTop: 9,
    color: '#fffdf6',
    fontFamily: Platform.select({ ios: 'Georgia', android: 'serif' }),
      fontFamily: Platform.select({ ios: 'Trebuchet MS', android: 'sans-serif-rounded' }),
      backgroundColor: '#3e9c68',
    fontSize: 29,
    lineHeight: 36,
    fontWeight: '700',
  },
  plannerSubtitle: {
    maxWidth: 420,
    marginTop: 7,
    color: '#e0eadc',
    fontSize: 13,
    lineHeight: 20,
  },
  plannerSectionHeading: {
    marginTop: 25,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  plannerSectionTitle: {
    color: '#24362d',
      color: '#24324a',
    fontSize: 17,
    fontWeight: '800',
  },
  plannerSectionSubtitle: {
    marginTop: 4,
    color: '#68756b',
      color: '#667085',
      backgroundColor: '#6b5bd2',
    fontSize: 11,
    lineHeight: 16,
  },
  weekBadge: {
    minHeight: 31,
    paddingHorizontal: 9,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    borderRadius: 14,
    backgroundColor: '#31564a',
  },
  weekBadgeText: {
    color: '#edf5e9',
    fontSize: 8,
    fontWeight: '800',
  },
  plannerMethods: {
    gap: 10,
  },
  plannerMethodCard: {
    minHeight: 82,
    paddingHorizontal: 14,
    paddingVertical: 13,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#d5ded1',
    borderColor: '#f1d6a2',
    borderRadius: 20,
    backgroundColor: '#fffefa',
  },
  plannerMethodCardSelected: {
    borderWidth: 2,
    borderColor: '#4d8b57',
    borderColor: '#f26b4f',
    backgroundColor: '#fff0d0',
  },
  plannerMethodIconWrap: {
    width: 43,
    height: 43,
    marginRight: 13,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 13,
    borderRadius: 16,
    backgroundColor: '#bcebd0',
  },
  plannerMethodIconWrap2: {
    backgroundColor: '#f9e4cf',
    backgroundColor: '#ffd2bd',
  },
  plannerMethodIconWrap3: {
    backgroundColor: '#d9eeea',
    backgroundColor: '#cfc5fa',
  },
  plannerMethodIcon: {
    fontSize: 22,
  },
  plannerMethodCopy: {
    flex: 1,
    marginRight: 10,
  },
  plannerMethodTitle: {
    color: '#273b32',
      color: '#24324a',
    fontSize: 13,
    fontWeight: '800',
  },
  plannerMethodTitleSelected: {
    color: '#376f43',
    color: '#d8523c',
  },
  plannerMethodDetail: {
    marginTop: 4,
    color: '#6f796f',
    fontSize: 11,
    lineHeight: 16,
  },
  plannerRadio: {
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#a9b5a6',
    borderRadius: 10,
  },
  plannerRadioSelected: {
    borderColor: '#4d8b57',
  },
  plannerRadioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#4d8b57',
  },
  plannerBackButton: { minHeight: 38, paddingHorizontal: 10, flexDirection: 'row', alignItems: 'center', gap: 6, borderWidth: 1, borderColor: '#527267', borderRadius: 12, backgroundColor: '#31564a' },
  plannerBackText: { color: '#e8f2df', fontSize: 10, fontWeight: '700' },
  destinationIntro: { marginBottom: 20 },
  destinationTitle: { marginTop: 7, color: '#24362d', fontFamily: Platform.select({ ios: 'Georgia', android: 'serif' }), fontSize: 28, lineHeight: 35, fontWeight: '700' },
  destinationSubtitle: { maxWidth: 520, marginTop: 6, color: '#68756b', fontSize: 12, lineHeight: 18 },
  moodGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  moodCard: { width: '48.5%', minHeight: 145, marginBottom: 10, padding: 13, borderWidth: 1, borderColor: '#d5ded1', borderRadius: 15, backgroundColor: '#fffefa' },
  moodCardSelected: { borderWidth: 2, borderColor: '#4d8b57', backgroundColor: '#f5faef' },
  moodEmojiWrap: { width: 43, height: 43, marginBottom: 11, alignItems: 'center', justifyContent: 'center', borderRadius: 14 },
  moodEmoji: { fontSize: 23 },
  moodTitle: { color: '#273b32', fontSize: 12, fontWeight: '800' },
  moodDetail: { marginTop: 4, color: '#6f796f', fontSize: 10, lineHeight: 14 },
  moodCheck: { position: 'absolute', top: 11, right: 11 },
  mealList: { gap: 9 },
  mealCard: { minHeight: 89, padding: 11, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#d5ded1', borderRadius: 13, backgroundColor: '#fffefa' },
  mealCardSelected: { borderWidth: 2, borderColor: '#4d8b57', backgroundColor: '#f5faef' },
  mealEmojiWrap: { width: 54, height: 58, marginRight: 12, alignItems: 'center', justifyContent: 'center', borderRadius: 12, backgroundColor: '#f4ebd6' },
  mealEmoji: { fontSize: 27 },
  mealCardCopy: { flex: 1, marginRight: 8 },
  mealTitle: { color: '#273b32', fontSize: 12, fontWeight: '800' },
  mealDetail: { marginTop: 3, color: '#6f796f', fontSize: 10, lineHeight: 14 },
  mealMeta: { marginTop: 6, color: '#71866e', fontSize: 9, fontWeight: '700' },
  mealDetailHero: { alignItems: 'center', padding: 22, borderRadius: 24, backgroundColor: '#ffd45c' },
  mealDetailEmojiWrap: { width: 92, height: 92, marginBottom: 15, alignItems: 'center', justifyContent: 'center', borderRadius: 30, backgroundColor: '#fff0d0' },
  mealDetailEmoji: { fontSize: 49 },
  mealDetailTitle: { marginTop: 8, color: '#24324a', fontFamily: Platform.select({ ios: 'Trebuchet MS', android: 'sans-serif-rounded' }), fontSize: 28, lineHeight: 34, fontWeight: '800', textAlign: 'center' },
  mealDetailSubtitle: { maxWidth: 430, marginTop: 7, color: '#4d5b69', fontSize: 12, lineHeight: 18, textAlign: 'center' },
  mealDetailMetaRow: { marginTop: 16, flexDirection: 'row', gap: 9 },
  mealDetailMeta: { minHeight: 32, paddingHorizontal: 11, flexDirection: 'row', alignItems: 'center', gap: 5, borderRadius: 16, backgroundColor: '#fff4d5' },
  mealDetailMetaText: { color: '#d8523c', fontSize: 10, fontWeight: '800' },
  nutritionCard: { marginTop: 14, padding: 15, borderRadius: 20, backgroundColor: '#fffefa' },
  detailSectionHeading: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  detailSectionTitle: { color: '#24324a', fontSize: 15, fontWeight: '800' },
  detailSectionCaption: { color: '#8a8f9a', fontSize: 10 },
  macroGrid: { marginTop: 12, flexDirection: 'row', gap: 8 },
  macroStat: { flex: 1, minHeight: 67, padding: 10, borderRadius: 15 },
  macroStatProtein: { backgroundColor: '#d9f1df' },
  macroStatCarbs: { backgroundColor: '#d8f1ed' },
  macroStatFat: { backgroundColor: '#ffdccc' },
  macroStatValue: { color: '#24324a', fontSize: 17, fontWeight: '800' },
  macroStatLabel: { marginTop: 3, color: '#667085', fontSize: 10, fontWeight: '700' },
  recipeSection: { marginTop: 14, padding: 15, borderRadius: 20, backgroundColor: '#fffefa' },
  ingredientList: { marginTop: 10, marginBottom: 22, gap: 8 },
  ingredientRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  ingredientText: { color: '#4b596b', fontSize: 12 },
  recipeSteps: { marginTop: 11, gap: 13 },
  recipeStep: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  recipeStepNumber: { width: 25, height: 25, alignItems: 'center', justifyContent: 'center', borderRadius: 13, backgroundColor: '#cfc5fa' },
  recipeStepNumberText: { color: '#5147a5', fontSize: 11, fontWeight: '800' },
  recipeStepText: { flex: 1, paddingTop: 3, color: '#4b596b', fontSize: 11, lineHeight: 17 },
  emptyMeals: { padding: 16, color: '#68756b', fontSize: 12, lineHeight: 18, borderWidth: 1, borderColor: '#d5ded1', borderRadius: 13, backgroundColor: '#f8faf5' },
  fridgeScene: { position: 'relative', minHeight: 330, marginBottom: 14, alignItems: 'center', justifyContent: 'center', borderRadius: 28, backgroundColor: '#ffe7a7', overflow: 'hidden' },
  tocaFridge: { width: '96%', maxWidth: 390, height: 310, alignSelf: 'center', flexDirection: 'row', alignItems: 'stretch', justifyContent: 'center' },
  fridgeCabinet: { width: '50%', padding: 9, borderWidth: 7, borderColor: '#6eaec2', borderRadius: 20, backgroundColor: '#bde5ec', shadowColor: '#638b9b', shadowOpacity: 0.22, shadowRadius: 3, shadowOffset: { width: 2, height: 3 } },
  fridgeFreezerGraphic: { height: 47, marginBottom: 7, padding: 5, justifyContent: 'center', borderRadius: 10, backgroundColor: '#d9f0ee' },
  fridgeBin: { height: 30, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', borderRadius: 8, backgroundColor: '#f8fbf2' },
  fridgeIceTray: { width: 17, height: 17, borderRadius: 5, backgroundColor: '#b7dff1' },
  fridgeShelfGraphic: { height: 50, marginBottom: 5, paddingHorizontal: 6, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', borderBottomWidth: 6, borderBottomColor: '#f8fbf2', borderRadius: 4, backgroundColor: '#a9d8de' },
  fridgeCrisperGraphic: { height: 38, alignItems: 'center', justifyContent: 'center', borderRadius: 9, backgroundColor: '#d5eeea' },
  fridgeCrisperText: { color: '#6e9fa3', fontSize: 7, fontWeight: '800', letterSpacing: 1 },
  openFridgeDoorGraphic: { position: 'relative', width: '26%', padding: 6, justifyContent: 'space-around', borderWidth: 6, borderColor: '#8bc6bd', borderRadius: 18, backgroundColor: '#d4f0e8' },
  leftFridgeDoor: { marginRight: -5, zIndex: 2 },
  rightFridgeDoor: { marginLeft: -5, zIndex: 2 },
  fridgeDoorHinge: { position: 'absolute', top: 14, bottom: 14, width: 8, borderRadius: 4, backgroundColor: '#659f9e', zIndex: 3 },
  leftDoorHinge: { right: -6 },
  rightDoorHinge: { left: -6 },
  doorShelf: { height: 42, paddingHorizontal: 5, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', borderBottomWidth: 4, borderBottomColor: '#f7fff8', borderRadius: 6, backgroundColor: '#b9e2d5' },
  fridgeFoodBlock: { width: 24, height: 27, borderRadius: 6 },
  fridgeItemPressable: { position: 'relative', minWidth: 29, minHeight: 29, alignItems: 'center', justifyContent: 'center', borderRadius: 8 },
  fridgeItemTooltip: { position: 'absolute', bottom: 29, left: '50%', zIndex: 20, minWidth: 54, paddingHorizontal: 7, paddingVertical: 4, borderRadius: 7, backgroundColor: '#24324a', transform: [{ translateX: -27 }] },
  fridgeItemTooltipText: { color: '#fff', fontSize: 9, fontWeight: '800', textAlign: 'center' },
  fridgeIconBlue: { padding: 4, borderRadius: 8, backgroundColor: '#c9e8f5' },
  fridgeIconPink: { padding: 4, borderRadius: 8, backgroundColor: '#ffd8df' },
  fridgeIconYellow: { padding: 4, borderRadius: 8, backgroundColor: '#ffedaa' },
  fridgeIconGreen: { padding: 4, borderRadius: 8, backgroundColor: '#ccebd0' },
  fridgeIconPurple: { padding: 4, borderRadius: 8, backgroundColor: '#e1dbff' },
  fridgeRoundContainer: { width: 29, height: 29, borderRadius: 15 },
  fridgeBag: { width: 25, height: 32, borderRadius: 5, transform: [{ rotate: '-7deg' }] },
  fridgeMilkCarton: { width: 28, height: 32, paddingTop: 5, alignItems: 'center', borderRadius: 4, backgroundColor: '#fffdf4' },
  fridgeMilkTop: { width: 18, height: 6, borderRadius: 3, backgroundColor: '#75b9e2' },
  fridgeJar: { width: 23, height: 27, borderRadius: 5 },
  fridgeBottle: { width: 16, height: 31, borderRadius: 7, backgroundColor: '#f5d15f' },
  fridgeBottleCap: { width: 10, height: 5, alignSelf: 'center', borderRadius: 2, backgroundColor: '#f19aab' },
  fridgeBowl: { width: 32, height: 20, alignItems: 'center', justifyContent: 'center', borderRadius: 6 },
  fridgeBowlInner: { width: 21, height: 8, borderRadius: 5, backgroundColor: '#fff2c8' },
  fridgeBlueBlock: { backgroundColor: '#75b9e2' },
  fridgePinkBlock: { backgroundColor: '#f19aab' },
  fridgeYellowBlock: { backgroundColor: '#f5d15f' },
  fridgeGreenBlock: { backgroundColor: '#82c98b' },
  fridgePurpleBlock: { backgroundColor: '#a99bdb' },
  fridgeOrangeBlock: { backgroundColor: '#f3a067' },
  fridgeTopLine: { position: 'absolute', top: 0, left: 0, right: 0, height: 9, backgroundColor: '#aeb8bb' },
  fridgeInterior: { flex: 1, marginTop: 8, padding: 10, borderWidth: 3, borderColor: '#9da9ad', borderRadius: 7, backgroundColor: '#f4f7f6' },
  fridgeFreezer: { minHeight: 46, paddingHorizontal: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 5, borderBottomColor: '#aebabe', backgroundColor: '#e3e9e8' },
  fridgeCompartmentLabel: { color: '#7e898d', fontSize: 8, fontWeight: '800', letterSpacing: 1 },
  fridgeFreezerHandle: { width: 44, height: 5, borderRadius: 3, backgroundColor: '#adb9bc' },
  fridgeShelf: { minHeight: 47, paddingHorizontal: 10, justifyContent: 'flex-end', borderBottomWidth: 5, borderBottomColor: '#aebabe', borderRadius: 2, backgroundColor: '#f0f4f3' },
  emptyShelfSpace: { flex: 1 },
  fridgeDrawerRow: { minHeight: 39, flexDirection: 'row', gap: 7 },
  fridgeDrawer: { flex: 1, minHeight: 32, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#b7c3c5', borderRadius: 5, backgroundColor: '#e0e7e6' },
  fridgeDrawerLabel: { color: '#7e8c90', fontSize: 7, fontWeight: '800', letterSpacing: 0.8 },
  fridgePhotoSlot: { position: 'absolute', left: '29%', bottom: '9%', width: '42%', alignItems: 'center', padding: 7, borderWidth: 2, borderColor: '#4b8dcc', borderRadius: 14, backgroundColor: '#dff4f2', transform: [{ rotate: '2deg' }] },
  fridgePhotoSlotTitle: { color: '#315b82', fontSize: 9, fontWeight: '800', textAlign: 'center' },
  fridgePhotoButton: { minHeight: 34, marginTop: 7, paddingHorizontal: 9, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5, borderRadius: 13, backgroundColor: '#4b8dcc' },
  fridgePhotoButtonText: { color: '#fff', fontSize: 9, fontWeight: '800' },
  fridgeLibraryButton: { marginTop: 6, paddingHorizontal: 3 },
  fridgeLibraryButtonText: { color: '#315b82', fontSize: 8, fontWeight: '700', textAlign: 'center' },
  manualIngredientsCard: { marginBottom: 12, padding: 15, borderWidth: 1, borderColor: '#c4dce1', borderRadius: 18, backgroundColor: '#f2fbf7' },
  manualIngredientsHeading: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  manualIngredientsTitle: { color: '#315b6f', fontSize: 13, fontWeight: '800' },
  manualIngredientsSubtitle: { marginTop: 3, color: '#718b91', fontSize: 10 },
  manualIngredientInputRow: { minHeight: 43, marginTop: 12, paddingLeft: 11, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#b8d3d8', borderRadius: 12, backgroundColor: '#fffefa' },
  manualIngredientInput: { minWidth: 0, flex: 1, paddingVertical: 8, color: '#315b6f', fontSize: 12 },
  manualIngredientAddButton: { width: 38, height: 38, marginRight: 2, alignItems: 'center', justifyContent: 'center', borderRadius: 10, backgroundColor: '#4b8dcc' },
  manualIngredientList: { marginTop: 9, gap: 6 },
  manualIngredientRow: { minHeight: 35, paddingLeft: 11, flexDirection: 'row', alignItems: 'center', borderRadius: 10, backgroundColor: '#dff1ea' },
  manualIngredientText: { flex: 1, color: '#315b6f', fontSize: 11, fontWeight: '700' },
  manualIngredientEditInput: { flex: 1, paddingVertical: 5, color: '#315b6f', fontSize: 11, fontWeight: '700' },
  manualIngredientIconButton: { width: 32, height: 32, alignItems: 'center', justifyContent: 'center' },
  pantryIdeaSummary: { minHeight: 45, marginBottom: 12, paddingHorizontal: 13, flexDirection: 'row', alignItems: 'center', gap: 9, borderWidth: 1, borderColor: '#f2c3a4', borderRadius: 13, backgroundColor: '#fff0d0' },
  pantryIdeaSummaryText: { flex: 1, color: '#8c5945', fontSize: 11, fontWeight: '800' },
  fridgeDoor: { width: '27%', minWidth: 88, marginTop: 8, marginLeft: 11, padding: 11, alignItems: 'center', justifyContent: 'center', borderWidth: 3, borderColor: '#aeb8bb', borderRadius: 7, backgroundColor: '#f8faf9' },
  fridgeDoorHandle: { width: 8, height: 104, marginBottom: 11, borderRadius: 4, backgroundColor: '#aebabe' },
  fridgeDoorText: { color: '#7b898e', fontSize: 8, fontWeight: '800', textAlign: 'center' },
  fridgeCaption: { position: 'absolute', right: 15, bottom: 10, flexDirection: 'row', alignItems: 'center', gap: 5 },
  fridgeCaptionEmoji: { fontSize: 15 },
  fridgeCaptionText: { color: '#718187', fontSize: 9, fontWeight: '800' },
  mealSelectMark: { width: 20, height: 20, alignItems: 'center', justifyContent: 'center', borderWidth: 1.5, borderColor: '#a9b5a6', borderRadius: 6 },
  mealSelectMarkSelected: { borderColor: '#4d8b57', backgroundColor: '#4d8b57' },
  photoPrompt: { alignItems: 'center', paddingHorizontal: 20, paddingVertical: 24, borderWidth: 1, borderColor: '#cfdcc8', borderRadius: 17, backgroundColor: '#f8faf5' },
  photoPromptIcon: { width: 58, height: 58, marginBottom: 12, alignItems: 'center', justifyContent: 'center', borderRadius: 18, backgroundColor: '#dcebd4' },
  photoPromptTitle: { color: '#273b32', fontSize: 14, fontWeight: '800', textAlign: 'center' },
  photoPromptDetail: { maxWidth: 390, marginTop: 6, color: '#6f796f', fontSize: 11, lineHeight: 16, textAlign: 'center' },
  photoActions: { width: '100%', maxWidth: 350, marginTop: 17, gap: 8 },
  cameraAction: { minHeight: 45, paddingHorizontal: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 9, borderRadius: 12, backgroundColor: '#31564a' },
  cameraActionText: { color: '#fffefa', fontSize: 11, fontWeight: '800' },
  libraryAction: { minHeight: 43, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, borderWidth: 1, borderColor: '#cfdcc8', borderRadius: 12, backgroundColor: '#fffefa' },
  libraryActionText: { color: '#31564a', fontSize: 11, fontWeight: '700' },
  photoGrid: { marginTop: 12, flexDirection: 'row', flexWrap: 'wrap', gap: 9 },
  photoThumbWrap: { width: 92, height: 92, borderRadius: 12, backgroundColor: '#dcebd4' },
  photoThumb: { width: '100%', height: '100%', borderRadius: 12 },
  photoRemove: { position: 'absolute', top: 5, right: 5, width: 24, height: 24, alignItems: 'center', justifyContent: 'center', borderRadius: 12, backgroundColor: 'rgba(36,68,58,0.85)' },
  plannerActionDisabled: { opacity: 0.45 },
  calendarSummary: {
    minHeight: 45,
    marginBottom: 12,
    paddingHorizontal: 13,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    borderWidth: 1,
    borderColor: '#d5ded1',
    borderRadius: 12,
    backgroundColor: '#f8faf5',
  },
  calendarSummaryText: { flex: 1, color: '#31564a', fontSize: 11, fontWeight: '800' },
  calendarSummaryMeta: { color: '#788477', fontSize: 9, fontWeight: '800' },
  weekCalendar: { gap: 8, overflow: 'visible' },
  calendarDay: {
    position: 'relative',
    padding: 11,
    borderWidth: 1,
    borderColor: '#d5ded1',
    borderRadius: 13,
    backgroundColor: '#fffefa',
    overflow: 'visible',
  },
  calendarDayFilled: { borderColor: '#c5d7bc' },
  calendarDayDragging: { zIndex: 100, elevation: 20, borderColor: '#78a967' },
  calendarDayHeading: {
    minHeight: 24,
    marginBottom: 7,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  calendarDayNameWrap: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  calendarDayIndex: { color: '#8a9386', fontSize: 9, fontWeight: '800' },
  calendarDayName: { color: '#273b32', fontSize: 12, fontWeight: '800' },
  calendarDayMealCount: { color: '#758171', fontSize: 9, fontWeight: '700' },
  calendarPlaceButton: { minHeight: 28, paddingHorizontal: 9, alignItems: 'center', justifyContent: 'center', borderRadius: 9, backgroundColor: '#dcebd4' },
  calendarPlaceButtonText: { color: '#31564a', fontSize: 9, fontWeight: '800' },
  calendarDropZone: {
    position: 'relative',
    minHeight: 54,
    padding: 5,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#e3e9df',
    borderRadius: 10,
    backgroundColor: '#f8faf5',
    overflow: 'visible',
  },
  calendarDropZoneEmpty: { borderStyle: 'dashed', backgroundColor: '#fbfcf9' },
  calendarEmptyLabel: { paddingVertical: 8, color: '#9aa494', fontSize: 10, textAlign: 'center' },
  calendarPlaceholderCard: { minHeight: 43, paddingHorizontal: 9, flexDirection: 'row', alignItems: 'center', gap: 8, borderWidth: 1, borderStyle: 'dashed', borderColor: '#d9e2d4', borderRadius: 9, backgroundColor: '#fbfcf9' },
  calendarPlaceholderEmoji: { fontSize: 17, opacity: 0.72 },
  calendarPlaceholderCopy: { flex: 1 },
  calendarPlaceholderTitle: { color: '#72806e', fontSize: 10, fontWeight: '700' },
  calendarPlaceholderHint: { marginTop: 2, color: '#98a190', fontSize: 8 },
  calendarMealCard: {
    position: 'relative',
    zIndex: 10,
    minHeight: 43,
    marginVertical: 3,
    paddingHorizontal: 9,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: '#d4e1cc',
    borderRadius: 9,
    backgroundColor: '#edf5e7',
  },
  calendarMealPressable: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8 },
  calendarScheduledRow: { marginVertical: 3, flexDirection: 'row', alignItems: 'center', gap: 4, overflow: 'visible' },
  calendarMealDragging: { zIndex: 1000, elevation: 30, borderColor: '#4d8b57', backgroundColor: '#e0efd5' },
  calendarMealEmoji: { fontSize: 17 },
  calendarMealCopy: { flex: 1 },
  calendarMealName: { color: '#31564a', fontSize: 10, fontWeight: '800' },
  calendarMealTime: { marginTop: 2, color: '#71866e', fontSize: 9 },
  calendarMoveHandle: { width: 28, height: 30, alignItems: 'center', justifyContent: 'center' },
  plannerConfirmation: {
    marginTop: 14,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: '#c7dbbb',
    borderRadius: 12,
    backgroundColor: '#f5faef',
  },
  plannerConfirmationText: {
    flex: 1,
    color: '#385c3e',
    fontSize: 11,
    lineHeight: 16,
  },
  plannerFooter: {
    paddingTop: 12,
    paddingHorizontal: 22,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#d8e0d4',
    backgroundColor: '#f8faf6',
  },
  plannerFooterNote: {
    color: '#68756b',
    fontSize: 10,
  },
  plannerAction: {
    minHeight: 48,
    paddingHorizontal: 17,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 15,
    borderRadius: 12,
    backgroundColor: '#ffdc70',
  },
  plannerActionSaved: {
    backgroundColor: '#d5e8ca',
  },
  plannerActionText: {
    color: '#24443a',
    fontSize: 12,
    fontWeight: '800',
  },
  safeArea: {
    flex: 1,
    backgroundColor: colors.paper,
  },
  screen: {
    flex: 1,
    backgroundColor: colors.paper,
  },
  topbar: {
    minHeight: 68,
    marginHorizontal: 16,
    marginTop: 7,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 2,
    borderBottomColor: colors.line,
    borderColor: colors.line,
    borderRadius: 22,
    backgroundColor: '#fffdf6',
  },
  wordmark: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  wordmarkMark: {
    width: 30,
    height: 30,
    marginRight: 7,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.tomato,
  },
  wordmarkText: {
    color: colors.ink,
    fontSize: 20,
    fontWeight: '800',
  },
  wordmarkPeriod: {
    color: colors.orange,
  },
  stepIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 18,
    backgroundColor: '#fff7df',
  },
  stepCurrent: {
    color: colors.tomato,
    fontSize: 10,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },
  stepTotal: {
    marginLeft: 3,
    color: colors.muted,
    fontSize: 9,
    fontVariant: ['tabular-nums'],
  },
  stepLine: {
    width: 14,
    height: 3,
    marginHorizontal: 9,
    borderRadius: 2,
    backgroundColor: colors.sky,
  },
  stepLabel: {
    color: colors.ink,
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  helpButton: {
    width: 40,
    height: 40,
    backgroundColor: colors.butter,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 22,
    paddingTop: 19,
  },
  formIntro: {
    paddingBottom: 3,
  },
  formKicker: {
    color: colors.tomato,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1.2,
  },
  title: {
    marginTop: 10,
    marginBottom: 5,
    color: colors.ink,
    fontFamily: Platform.select({ ios: 'Georgia', android: 'serif' }),
    fontSize: 30,
    lineHeight: 36,
    fontWeight: '700',
  },
  introDescription: {
    color: '#64756a',
    fontSize: 13,
    lineHeight: 20,
  },
  kitchenArt: {
    minHeight: 77,
    marginTop: 13,
    paddingHorizontal: 10,
    paddingVertical: 9,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#f2cd61',
    borderRadius: 19,
    backgroundColor: colors.butter,
  },
  stickerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 9,
  },
  ingredientSticker: {
    width: 36,
    height: 36,
    marginRight: -4,
    borderWidth: 2,
    borderColor: '#fffdf6',
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 1,
  },
  ingredientSticker1: {
    backgroundColor: '#dff0c9',
  },
  ingredientSticker2: {
    backgroundColor: '#ffd6c6',
  },
  ingredientSticker3: {
    backgroundColor: '#d8f1ed',
  },
  ingredientEmoji: {
    fontSize: 19,
  },
  artCopy: {
    flex: 1,
    minWidth: 0,
  },
  artKicker: {
    color: '#926424',
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 0.9,
  },
  artCaption: {
    marginTop: 3,
    color: colors.ink,
    fontSize: 11,
    fontWeight: '700',
  },
  fieldGroup: {
    marginTop: 14,
    paddingVertical: 16,
  },
  fieldHeading: {
    minHeight: 24,
    marginBottom: 13,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  answerHint: {
    minHeight: 24,
    marginBottom: 13,
    flexDirection: 'row',
    alignItems: 'center',
  },
  combinedRestrictions: {
    paddingBottom: 20,
  },
  restrictionsGroup: {
    marginTop: 14,
    paddingTop: 17,
    borderTopWidth: 2,
    borderTopColor: '#f0e4c2',
  },
  fieldTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 1,
  },
  sectionNumber: {
    width: 23,
    height: 23,
    marginRight: 9,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#dff0d4',
  },
  sectionNumberText: {
    color: colors.green,
    fontSize: 9,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },
  fieldTitle: {
    flexShrink: 1,
    color: colors.ink,
    fontSize: 12,
    fontWeight: '700',
  },
  fieldDescription: {
    maxWidth: '48%',
    color: '#718070',
    fontSize: 10,
    textAlign: 'right',
  },
  dietOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  dietOption: {
    width: '48.5%',
    minHeight: 66,
    marginBottom: 8,
    paddingHorizontal: 9,
    paddingVertical: 9,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e8dfc4',
    borderRadius: 16,
    backgroundColor: '#fffefa',
  },
  dietOptionSelected: {
    borderColor: colors.green,
    backgroundColor: '#edf7df',
  },
  radioMark: {
    width: 16,
    height: 16,
    marginRight: 9,
    borderWidth: 1,
    borderColor: '#c4c8bd',
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioMarkSelected: {
    borderColor: colors.green,
  },
  radioDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: colors.green,
  },
  dietCopy: {
    flex: 1,
  },
  dietName: {
    color: colors.ink,
    fontSize: 11,
    fontWeight: '700',
  },
  dietDetail: {
    marginTop: 2,
    color: colors.muted,
    fontSize: 9,
  },
  tagBox: {
    minHeight: 54,
    padding: 8,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e8dfc4',
    borderRadius: 16,
    backgroundColor: '#fffefa',
  },
  tag: {
    minHeight: 28,
    margin: 2,
    paddingLeft: 9,
    paddingRight: 5,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    backgroundColor: colors.chip,
  },
  tagText: {
    color: '#3b6144',
    fontSize: 10,
  },
  tagRemove: {
    width: 22,
    height: 24,
    marginLeft: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tagInput: {
    minWidth: 150,
    minHeight: 34,
    flexGrow: 1,
    flexShrink: 1,
    paddingHorizontal: 3,
    color: colors.ink,
    fontSize: 16,
  },
  addButton: {
    width: 36,
    height: 36,
    margin: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 13,
    backgroundColor: '#d9f1ee',
  },
  goalsGroup: {
    paddingBottom: 20,
  },
  goalOptions: {
    flexDirection: 'column',
  },
  goalItem: {
    marginBottom: 9,
  },
  goalOption: {
    minHeight: 46,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 2,
    borderColor: '#e8dfc4',
    borderRadius: 16,
    backgroundColor: '#fffefa',
  },
  goalOptionSelected: {
    borderColor: colors.green,
    backgroundColor: '#edf7df',
  },
  checkboxMark: {
    width: 14,
    height: 14,
    marginRight: 7,
    borderWidth: 1,
    borderColor: '#c7c9bd',
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxMarkSelected: {
    borderColor: colors.green,
    backgroundColor: colors.green,
  },
  goalText: {
    color: '#626b60',
    fontSize: 10,
  },
  goalTextSelected: {
    color: '#3e6547',
  },
  goalChevron: {
    marginLeft: 'auto',
  },
  goalDetailCard: {
    marginTop: 7,
    marginLeft: 12,
    padding: 12,
    borderWidth: 2,
    borderColor: '#cde4b7',
    borderRadius: 15,
    backgroundColor: '#f3f8e9',
  },
  detailPrompt: {
    marginBottom: 9,
    color: colors.ink,
    fontSize: 11,
    fontWeight: '700',
  },
  stepperRow: {
    minHeight: 42,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  detailLabel: {
    flex: 1,
    color: '#64756a',
    fontSize: 10,
  },
  stepperControl: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#d6e3ca',
    borderRadius: 14,
    backgroundColor: '#fffefa',
  },
  stepperButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 13,
    backgroundColor: '#d9f1ee',
  },
  stepperValue: {
    minWidth: 54,
    color: colors.ink,
    fontSize: 12,
    fontWeight: '800',
    textAlign: 'center',
  },
  stepperUnit: {
    color: colors.muted,
    fontSize: 9,
    fontWeight: '500',
  },
  focusOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  focusOption: {
    minHeight: 34,
    marginRight: 6,
    marginBottom: 6,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#d6e3ca',
    borderRadius: 14,
    backgroundColor: '#fffefa',
  },
  focusOptionSelected: {
    borderColor: colors.green,
    backgroundColor: '#e8f4d7',
  },
  focusText: {
    color: '#64756a',
    fontSize: 10,
  },
  focusTextSelected: {
    marginRight: 5,
    color: colors.greenDark,
    fontWeight: '700',
  },
  budgetOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  budgetOption: {
    minWidth: 52,
    minHeight: 38,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#d6e3ca',
    borderRadius: 13,
    backgroundColor: '#fffefa',
  },
  budgetOptionSelected: {
    borderColor: colors.tomato,
    backgroundColor: '#ffebe3',
  },
  budgetText: {
    color: '#64756a',
    fontSize: 11,
    fontWeight: '600',
  },
  budgetTextSelected: {
    color: '#be4b3b',
    fontWeight: '800',
  },
  budgetCaption: {
    marginTop: 7,
    color: colors.muted,
    fontSize: 9,
    textAlign: 'right',
  },
  dietaryNeedOption: {
    minHeight: 58,
    marginBottom: 8,
    paddingHorizontal: 13,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e8dfc4',
    borderRadius: 16,
    backgroundColor: '#fffefa',
  },
  dietaryNeedOptionSelected: {
    borderColor: colors.green,
    backgroundColor: '#edf7df',
  },
  dietaryNeedIcon: {
    marginRight: 11,
    fontSize: 22,
  },
  dietaryNeedCopy: {
    flex: 1,
  },
  dietaryNeedTitle: {
    color: colors.ink,
    fontSize: 12,
    fontWeight: '700',
  },
  healthGroup: {
    paddingBottom: 24,
  },
  unitSwitch: {
    marginBottom: 15,
    padding: 4,
    flexDirection: 'row',
    borderRadius: 15,
    backgroundColor: '#eee7d1',
  },
  unitChoice: {
    minHeight: 38,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
  },
  unitChoiceSelected: {
    backgroundColor: '#fffefa',
  },
  unitChoiceText: {
    color: colors.muted,
    fontSize: 10,
    fontWeight: '600',
  },
  unitChoiceTextSelected: {
    color: colors.greenDark,
    fontWeight: '800',
  },
  measurementsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  measurementField: {
    flex: 1,
  },
  measurementLabel: {
    marginBottom: 6,
    color: colors.ink,
    fontSize: 11,
    fontWeight: '700',
  },
  measurementInputRow: {
    minHeight: 49,
    paddingHorizontal: 11,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e8dfc4',
    borderRadius: 15,
    backgroundColor: '#fffefa',
  },
  measurementInput: {
    minWidth: 0,
    flex: 1,
    paddingVertical: 8,
    color: colors.ink,
    fontSize: 16,
    fontWeight: '700',
  },
  measurementUnit: {
    marginLeft: 5,
    color: colors.greenDark,
    fontSize: 11,
    fontWeight: '800',
  },
  healthQuestionGroup: {
    marginTop: 19,
  },
  optionalLabel: {
    color: colors.muted,
    fontSize: 10,
    fontWeight: '500',
  },
  healthChoiceGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 7,
  },
  healthChoice: {
    minHeight: 39,
    paddingHorizontal: 11,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#e8dfc4',
    borderRadius: 15,
    backgroundColor: '#fffefa',
  },
  healthChoiceSelected: {
    borderColor: colors.green,
    backgroundColor: '#edf7df',
  },
  healthChoiceText: {
    color: '#64756a',
    fontSize: 11,
    fontWeight: '600',
  },
  healthChoiceTextSelected: {
    color: colors.greenDark,
    fontWeight: '800',
  },
  activityOptions: {
    gap: 7,
  },
  activityOption: {
    minHeight: 43,
    paddingHorizontal: 11,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e8dfc4',
    borderRadius: 15,
    backgroundColor: '#fffefa',
  },
  activityOptionSelected: {
    borderColor: colors.green,
    backgroundColor: '#edf7df',
  },
  targetSection: {
    marginTop: 20,
  },
  targetInputRow: {
    minHeight: 49,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e8dfc4',
    borderRadius: 15,
    backgroundColor: '#fffefa',
  },
  targetInput: {
    minWidth: 0,
    flex: 1,
    paddingVertical: 8,
    color: colors.ink,
    fontSize: 16,
    fontWeight: '700',
  },
  targetUnit: {
    marginLeft: 8,
    color: colors.greenDark,
    fontSize: 11,
    fontWeight: '800',
  },
  macroTargetsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  macroTargetField: {
    minWidth: 0,
    flex: 1,
  },
  macroInputRow: {
    minHeight: 45,
    paddingHorizontal: 8,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e8dfc4',
    borderRadius: 14,
    backgroundColor: '#fffefa',
  },
  macroInput: {
    minWidth: 0,
    flex: 1,
    paddingVertical: 7,
    color: colors.ink,
    fontSize: 15,
    fontWeight: '700',
  },
  macroUnit: {
    marginLeft: 4,
    color: colors.greenDark,
    fontSize: 10,
    fontWeight: '800',
  },
  targetNote: {
    marginTop: 17,
    color: colors.muted,
    fontSize: 10,
    lineHeight: 15,
  },
  planMethodOptions: {
    gap: 10,
  },
  planMethodOption: {
    minHeight: 76,
    paddingHorizontal: 13,
    paddingVertical: 11,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e8dfc4',
    borderRadius: 17,
    backgroundColor: '#fffefa',
  },
  planMethodOptionSelected: {
    borderColor: colors.green,
    backgroundColor: '#edf7df',
  },
  planMethodIcon: {
    width: 38,
    height: 38,
    marginRight: 11,
    borderRadius: 13,
    backgroundColor: colors.butter,
    overflow: 'hidden',
    textAlign: 'center',
    textAlignVertical: 'center',
    fontSize: 21,
    lineHeight: 36,
  },
  planMethodCopy: {
    flex: 1,
    marginRight: 8,
  },
  planMethodTitle: {
    color: colors.ink,
    fontSize: 12,
    fontWeight: '700',
  },
  planMethodTitleSelected: {
    color: colors.greenDark,
  },
  planMethodDetail: {
    marginTop: 4,
    color: colors.muted,
    fontSize: 10,
    lineHeight: 14,
  },
  successMessage: {
    marginTop: 14,
    padding: 11,
    borderWidth: 2,
    borderColor: '#a8d78a',
    borderRadius: 15,
    backgroundColor: colors.selected,
  },
  successText: {
    color: '#45604a',
    fontSize: 11,
    lineHeight: 17,
  },
  bottomBar: {
    paddingTop: 10,
    paddingHorizontal: 22,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 2,
    borderTopColor: '#f0e4c2',
    backgroundColor: '#fffaf0',
  },
  backButton: {
    minHeight: 44,
    paddingHorizontal: 13,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    backgroundColor: '#d9f1ee',
  },
  backButtonText: {
    marginLeft: 7,
    color: '#356f67',
    fontSize: 12,
    fontWeight: '600',
  },
  requiredNote: {
    maxWidth: 132,
    color: colors.muted,
    fontSize: 9,
    lineHeight: 14,
  },
  continueButton: {
    minHeight: 52,
    paddingHorizontal: 17,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18,
    backgroundColor: colors.tomato,
    borderBottomWidth: 4,
    borderBottomColor: '#c94f3c',
  },
  continueButtonPressed: {
    backgroundColor: colors.greenDark,
  },
  continueButtonText: {
    marginRight: 15,
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
  },
  pressed: {
    opacity: 0.8,
  },
});