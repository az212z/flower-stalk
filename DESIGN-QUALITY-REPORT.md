# DESIGN-QUALITY-REPORT — Flower Stalk

## 1) المهارات المُستدعاة وكيف طُبّقت

### `ui-ux-pro-max` + `search.py --design-system`
شغّلت: `search.py "florist flower shop botanical elegant" --design-system`.
- **النمط الموصى به:** Organic Biophilic (طبيعي، أشكال عضوية، أخضر، أركان دائرية، ظلال طبيعية) → اعتمدته كأساس.
- **اللون الموصى به:** أخضر طبيعي + وردي زهري (`#15803D` / `#EC4899`). أبقيت روحه لكن خفّفت التشبّع إلى لوحة أرقى (sage `#8FA98A` + green `#3A5A40` + blush `#F4C9D0` + cream `#FAF6EF`) لأن الوردي النيون لا يليق بمحل ورد فاخر.
- **النمط:** Hero-Centric + Conversion (CTA فوق الطية) → طبّقته في الهيرو.
- **الخطوط:** التوصية كانت Noto JP (غير مناسبة للعربي)، فاستبدلتها بالمطلوب في البريف: **El Messiri** للعناوين + **Tajawal** للنص.
- **Pre-delivery checklist:** أيقونات SVG لا إيموجي، تباين ≥4.5:1، focus-visible، `prefers-reduced-motion`، responsive عند 375/768/1024/1440 — كلها مطبّقة.

### `design-taste-frontend`
- **Design Read:** "موقع florist تسويقي RTL لمشتري الهدايا في الدمام، بلغة بوتانيكال عصري، يميل لنظام sage/blush/cream + El Messiri + Tajawal." Dials: Variance 6 / Motion 6 / Density 3.
- **Anti-default:** تجنّبت AI-purple، الهيرو المتمركز فوق mesh، والكروت الثلاثة المتطابقة. الهيرو صورة حقيقية كاملة مع overlay، الخدمات 4 كروت بأيقونات مميزة.
- **Hero discipline:** عنوان ≤ سطرين، subtext < 20 كلمة، الـ CTAs ظاهرة بلا تمرير، `min-h:100dvh`.
- **No em-dash:** صفر em-dash/en-dash كزخرفة في كل النصوص الظاهرة.
- **Theme/Color/Shape locks:** ثيم فاتح واحد، لون accent واحد (rose) ثابت، نظام أركان واحد (pill للأزرار، 16–24px للكروت).
- **Images real:** كل الصور صور حقيقية للنشاط (لا fake screenshots، لا SVG زخرفية مرسومة يدوياً عدا الشعار الهندسي البسيط).
- **CTA discipline:** نيّة واحدة لكل CTA؛ "اطلب باقتك" هو الأساسي و"تواصل عبر واتساب" قناة. تباين نص الأزرار مُتحقَّق منه.

### `emil-design-eng`
- **Easing مخصص:** `--ease-out: cubic-bezier(0.23,1,0.32,1)` و`--ease-soft` بدل الـ easings الضعيفة الافتراضية.
- **مدد ضمن المعايير:** ضغط الأزرار 160ms، اللايتبوكس/القائمة 300–400ms، لا شيء يتجاوز 400ms للواجهة.
- **Scale-on-press:** `transform:scale(.97)` على `:active` لكل زر و FAB (تغذية لمسية فورية).
- **لا scale(0):** الكروت تظهر من `scale(.96)` + opacity لا من الصفر.
- **Transitions لا keyframes** للعناصر التفاعلية (toast/lightbox/menu) لتكون قابلة للمقاطعة؛ keyframes فقط للحركات المحددة مسبقاً (drift, kenburns, sheen).
- **Stagger 40ms** بين الكروت الشقيقة عند الظهور.
- **مراجعة بطيئة:** ضبطت توقيت ظهور الكروت ليتناسق opacity مع transform.

## 2) مخرجات design-system (palette/type)
- **Palette:** `--cream #FAF6EF` خلفية، `--green #2F4A35` نص، `--green-700 #3A5A40` brand، `--sage-deep #5C7A57`، `--blush #F4C9D0` / `--rose #C97A86` accent.
- **Typography:** El Messiri (600/700) للعناوين، Tajawal (400/500/700) للنص. سلّم: clamp في الهيرو/العناوين، 16px أساس، line-height 1.7.

## 3) قرارات UI/UX الأساسية
- هيكل: Header ثابت شفّاف → Hero (صورة + بتلات) → Trust bar أخضر بالتقييم → Services (4) → Why-us (صورة+قائمة) → Gallery (لايتبوكس) → Order form → Location → Final CTA → Footer + FABs.
- 4 عائلات layout مختلفة على الأقل (centered head, media+list split, grid gallery, split form) — لا تكرار.
- قائمة جوال ملء الشاشة `100vw/100dvh` خلفية خضراء صلبة + زر X واضح + روابط تظهر بـ stagger.

## 4) سبب الألوان/الخطوط
الأخضر الميرمية يربط الورد بالطبيعة ويوحي بالطزاجة، الوردي الخفيف يضيف الأنوثة الراقية دون مبالغة، الكريمي يمنح دفئاً فاخراً. El Messiri خط عربي أنيق بطابع راقٍ مناسب لنشاط الهدايا، وTajawal نظيف وعالي القراءة للنص.

## 5) تطبيق Hooked / UX السلوكي
- Trigger واضح: زر "اطلب باقتك" متكرر في نقاط القرار.
- Action سهل: نموذج قصير → واتساب بضغطة.
- Reward: toast نجاح + رسالة جاهزة.
- Investment: حفظ في localStorage يحاكي تتبّع الطلب.

## 6) تطبيق iOS HIG / لمس
- أهداف لمس ≥ 48px (أزرار/حقول/FABs/burger).
- تغذية ضغط < 150ms، بلا إزاحة layout.
- النموذج: حالة loading عند الإرسال ثم نجاح؛ الخطأ تحت الحقل مباشرة + focus على أول حقل خاطئ.
- `inputmode`/`autocomplete` مناسبة (tel/name) لفتح لوحة المفاتيح الصحيحة.

## 7) تطبيق Accessibility
- `<html lang="ar" dir="rtl">`، HTML سيمانتيك (header/nav/main/section/footer)، تدرّج عناوين h1→h3 بلا قفز.
- alt عربي وصفي لكل صورة + width/height + lazy لغير الهيرو + decoding=async.
- aria-label لكل زر أيقونة (burger, close, FABs, lightbox)، skip-link، focus-visible بـ outline 3px.
- تباين مُتحقَّق: نص أخضر `#2F4A35` على كريم، أبيض على أخضر `#3A5A40`، نص الهيرو الأبيض فوق overlay داكن — كلها ≥4.5:1.
- اللون ليس وسيلة المعنى الوحيدة (أيقونات + نص). دعم كامل لـ `prefers-reduced-motion` (يوقف البتلات/الكين-بيرنز/الـ reveal/اللمعة).

## 8) تطبيق Taste / Impeccable (§9)
- فاخر؟ نعم — ألوان هادئة، مساحات سخيّة، ظلال مُلوّنة بلون الخلفية، صور حقيقية كبيرة.
- سعودي مناسب؟ نعم — RTL، لغة طبيعية محايدة جندرياً ("اطلب باقتك / تواصل")، تقييم قوقل، أوقات عمل واقعية.
- يقنع خلال 3 ثوانٍ؟ نعم — صورة باقة فاخرة + عنوان واضح + CTA ظاهر.
- لا يشبه قالباً مجانياً؟ نعم — هوية بوتانيكال مميزة، حركة ورد مقصودة.

## الموشن المُوثّق (transform/opacity فقط، يحترم reduced-motion)
| الحركة | التفاصيل | المبرّر |
|---|---|---|
| بتلات منسابة | 6 بتلات CSS تهبط ببطء (13–21s) في الهيرو، opacity منخفض | إحساس "ورد" حيّ، عنصر واحد متحرك خلف النص |
| Ken-burns | صورة الهيرو scale 1.0→1.06 خلال 16s ثم تثبت | عمق سينمائي هادئ |
| Bloom-in للكروت | scale .96→1 + fade + stagger 40ms عبر IntersectionObserver | يحاكي تفتّح الزهرة عند التمرير، مع fallback يضمن الظهور |
| Hover zoom | صور المعرض/الأقسام scale 1.03–1.04 + رفع ظل | تفاعل لطيف يبرز الصورة |
| لمعة CTA | sheen يمر مرة عند hover على الزر الأساسي | جذب خفيف للـ CTA دون إزعاج |
| ضغط الأزرار | scale(.97) على :active (160ms ease-out) | تغذية لمسية فورية (Emil) |
| قائمة الجوال | انزلاق overlay 400ms + ظهور الروابط stagger | استمرارية مكانية |

كل ما سبق يتوقف/يبسّط تحت `@media (prefers-reduced-motion: reduce)`.
