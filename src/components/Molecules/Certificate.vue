<script setup>
    const props = defineProps({
        username :{
            type: String,
            default: ""
        },

    })

</script>


<template>
           <div class="row justify-content-center mb-4">
            <div class="col-12 col-md-10 col-lg-8">
                <div class="text-center congratulations-message mb-4 p-4">
                    <h2 class="mb-3 text-success">🎉 Congratulations, {{ username }}! 🎉</h2>
                    <p class="fs-5 mb-3">
                        You've just accomplished what 99% of users couldn't - you survived the gauntlet!
                    </p>
                    <p class="fs-6 mb-3">
                        You battled through scattered email boxes, mastered an impossible phone slider, 
                        defeated alien invaders, conquered 15 password requirements, chased down a moving button, 
                        and watched your password burn before your eyes. And yet, here you stand - victorious!
                    </p>
                    <p class="fs-5 fw-bold text-gold mb-3">
                        This is not just a registration. This is a testament to your unwavering determination.
                    </p>
                    <p class="fs-6">
                        Share your achievement with the world! Let others know you're one of the elite few 
                        who made it through "LetMeSignUpPls" - the ultimate test of patience and persistence.
                    </p>
                </div>
                <div class="certificate-card classic-certificate">
                    <div class="certificate-border">
                        <div class="certificate-content p-5">
                            <div class="certificate-header mb-4">
                                <h1 class="certificate-title">🏆 Certificate of Completion 🏆</h1>
                                <div class="certificate-subtitle">Let Me Sign Up Pls</div>
                            </div>
                            <div class="certificate-body">
                                <p class="mb-4">This is to certify that</p>
                                <h2 class="username-display mb-4">{{ username }}</h2>
                                <p class="mb-4">has successfully survived and conquered the world's most<br/>frustrating registration experience</p>
                                <div class="achievements mb-4">
                                    <div class="row">
                                        <div class="col-6 mb-3">✓ Assembled scattered emails</div>
                                        <div class="col-6 mb-3">✓ Mastered phone slider</div>
                                        <div class="col-6 mb-3">✓ Defeated Space Invaders</div>
                                        <div class="col-6 mb-3">✓ Survived 15 password rules</div>
                                        <div class="col-6 mb-3">✓ Caught the moving button</div>
                                        <div class="col-6 mb-3">✓ Endured burning passwords</div>
                                    </div>
                                </div>
                                <p class="certificate-date">Completed: {{ new Date().toLocaleDateString() }}</p>
                            </div>
                            <div class="certificate-seal">
                                <div class="seal-circle">
                                    <div class="seal-text">OFFICIAL<br/>SURVIVOR</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
</template>

<style>
    /* Congratulations Message */
.congratulations-message {
    background: var(--theme-dark-card-bg);
    border: 2px solid var(--theme-purple);
    border-radius: 15px;
    color: var(--theme-purple-light);
    box-shadow: 0 0 30px var(--theme-purple-rgba-30);
}

.congratulations-message h2 {
    color: var(--theme-gold);
    text-shadow: 0 0 20px var(--theme-gold-rgba-50);
}

.text-gold {
    color: var(--theme-gold) !important;
    text-shadow: 0 0 10px var(--theme-gold-rgba-50);
}

/* Certificate Card Base */
.certificate-card {
    background: white;
    border-radius: 15px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
    min-height: 600px;
    position: relative;
    overflow: hidden;
}

/* ===== TEMPLATE 1: CLASSIC GOLD ===== */
.classic-certificate {
    background: linear-gradient(135deg, #f5f5dc 0%, #fff8dc 100%);
}

.certificate-border {
    border: 20px solid;
    border-image: var(--gradient-gold) 1;
    height: 100%;
    position: relative;
}

.certificate-border::before {
    content: '';
    position: absolute;
    top: 15px;
    left: 15px;
    right: 15px;
    bottom: 15px;
    border: 3px solid var(--theme-gold-rgba-50);
    pointer-events: none;
}

.certificate-title {
    font-size: 2.5rem;
    color: var(--theme-gold-dark);
    font-weight: bold;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
}

.certificate-subtitle {
    font-size: 1.2rem;
    color: var(--theme-purple);
    font-style: italic;
}

.username-display {
    font-size: 3rem;
    color: var(--theme-purple-dark);
    font-family: 'Brush Script MT', cursive;
    border-bottom: 2px solid var(--theme-gold);
    display: inline-block;
    padding: 0 20px;
}

.certificate-body {
    color: #333;
    font-size: 1.1rem;
}

.achievements {
    background: var(--theme-purple-rgba-10);
    border-radius: 10px;
    padding: 20px;
    font-size: 0.95rem;
    color: #555;
}

.certificate-date {
    font-style: italic;
    color: #666;
}

.certificate-seal {
    position: absolute;
    bottom: 30px;
    right: 30px;
}

.seal-circle {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    background: var(--gradient-gold);
    border: 5px solid var(--theme-gold-dark);
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
}

.seal-text {
    text-align: center;
    font-size: 0.7rem;
    font-weight: bold;
    color: white;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
}

/* Responsive adjustments */
@media (max-width: 768px) {
    .username-display {
        font-size: 2rem;
    }
    
    .certificate-title {
        font-size: 1.8rem;
    }
}
</style>