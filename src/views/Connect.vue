<template>
    <v-container fill-height>
        <v-layout align-center justify-center>
            <v-card flat>
                <v-card-title>
                    <span
                        class="text-center"
                        style="width: 100%; color: darkred;"
                    >
                        <h2>Внимание!</h2>
                    </span>
                </v-card-title>
                <v-card-text>
                    <p class="text-center" style="width: 100%">
                        Начиная с версии приложения 0.3 для обеспечения доступа
                        к устройству потребуется предварительная авторизация
                        пользователя.
                    </p>
                    <p class="text-center font-weight-black">
                        Текущая версия: {{ $store.state.version }}
                    </p>
                </v-card-text>
                <v-card-actions>
                    <v-layout text-center wrap class="ma-8">
                        <v-flex>
                            <v-progress-circular
                                indeterminate
                                color="primary"
                                size="128"
                                >{{ 'connect' }}
                            </v-progress-circular>
                        </v-flex>
                    </v-layout>
                </v-card-actions>
            </v-card>
        </v-layout>
    </v-container>
</template>
