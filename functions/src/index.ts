import { onRequest } from "firebase-functions/v2/https";
import * as admin from "firebase-admin";
import { defineSecret } from "firebase-functions/params";

// Инициализация Firebase Admin SDK
admin.initializeApp();

// Определение секретов
const apiKey = defineSecret("API_KEY");
const authDomain = defineSecret("AUTH_DOMAIN");
const projectId = defineSecret("PROJECT_ID");
const storageBucket = defineSecret("STORAGE_BUCKET");
const messagingSenderId = defineSecret("MESSAGING_SENDER_ID");
const appId = defineSecret("APP_ID");

// Определение функции
export const getFirebaseConfig = onRequest(
    {
        secrets: [
            apiKey,
            authDomain,
            projectId,
            storageBucket,
            messagingSenderId,
            appId,
        ],
    },
    async (req, res) => {
        try {
            // Получаем токен из заголовка Authorization
            const idToken = req.headers.authorization?.split("Bearer ")[1];

            if (!idToken) {
                res.status(401).json({
                    error: "Unauthorized - No token provided",
                });
                return;
            }

            // Проверяем токен пользователя
            await admin.auth().verifyIdToken(idToken);

            // Отправляем конфигурацию
            res.json({
                apiKey: apiKey.value(),
                authDomain: authDomain.value(),
                projectId: projectId.value(),
                storageBucket: storageBucket.value(),
                messagingSenderId: messagingSenderId.value(),
                appId: appId.value(),
            });
        } catch (error) {
            console.error("Error verifying token or fetching config:", error);
            res.status(403).json({ error: "Forbidden - Invalid token" });
        }
    }
);
