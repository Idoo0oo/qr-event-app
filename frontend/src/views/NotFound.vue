<template>
    <div class="flex items-center justify-center min-h-screen bg-gray-100">
        <div class="text-center">
            <h1 class="text-9xl font-bold text-blue-500">404</h1>
            <p class="text-2xl md:text-3xl font-light text-gray-800 mt-4">
                Oops! Page not found.
            </p>
            <p class="text-gray-600 mt-2">
                The page you are looking for does not exist or has been moved.
            </p>
            <router-link to="/" class="mt-6 inline-block px-6 py-3 text-white bg-blue-600 rounded-md hover:bg-blue-700">
                Go to Homepage
            </router-link>
        </div>
    </div>
</template>

<script setup>
// No script needed for this simple component
</script>