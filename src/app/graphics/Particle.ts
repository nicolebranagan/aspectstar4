import Aspect from '../constants/Aspect';
import Master from '../interfaces/Master';
import Runner from '../interfaces/Runner';

export default {
    getAspectEffect(master : Master, asp : Aspect) : Runner {
        const drawables = new PIXI.Container();
        const particles : ColorParticle[] = [];
        for (let i = -6; i <= 6; i++) {
            for (let j = 0; j < 3; j++) {
                const particle1 = new ColorParticle(asp, i, -16+(i%4), 24-Math.abs(i), (j-1), 1);
                const particle2 = new ColorParticle(asp, i, -16+(i%4), 24-Math.abs(i), (j-1), -1);
                drawables.addChild(particle1.sprite);
                particles.push(particle1);
                drawables.addChild(particle2.sprite);
                particles.push(particle2);
            }
        }

        return {
            drawables: drawables,
            respond: function() {;},
            update: function() {
                const toDelete = [];
                for (const index in particles) {
                    const p = particles[index];
                    p.update();
                    if (!p.active) {
                        drawables.removeChild(p.sprite);
                        toDelete.push(index);
                    }
                }
                toDelete.reverse();
                for (const delindex of toDelete) {
                    particles.splice(Number(delindex), 1);
                }
                if (particles.length == 0)
                    master.removeRunner(this);
            }
        };
    },
    getAspectExplode(master : Master, asp: Aspect) : Runner {
        const drawables = new PIXI.Container();
        const particles : ColorParticle[] = [];
        for (let i = 0; i < 1080; i++) {
            const speed = Math.ceil(i / 360);
            const angle = 2 * Math.PI * ((i % 360) / 360);
            const x = speed*Math.sin(angle);
            const y = speed*Math.cos(angle);
            if (Math.floor(x*10) == 0 && Math.floor(y*10) == 0) 
                continue;
            const particle1 = new ColorParticle(asp, 0, -16, 320, x, y);
            drawables.addChild(particle1.sprite);
            particles.push(particle1);
        }

        return {
            drawables: drawables,
            respond: function() {;},
            update: function() {
                const toDelete = [];
                for (const index in particles) {
                    const p = particles[index];
                    p.update();
                    if (!p.active) {
                        drawables.removeChild(p.sprite);
                        toDelete.push(index);
                    }
                }
                toDelete.reverse();
                for (const delindex of toDelete) {
                    particles.splice(Number(delindex), 1);
                }
                if (particles.length == 0)
                    master.removeRunner(this);
            }
        };
    },
    getAspectImplode(master : Master, asp: Aspect) : Runner {
        const drawables = new PIXI.Container();
        const particles : ColorParticle[] = [];
        for (let i = 0; i < 360; i++) {
            const speed = 6;
            const angle = 2 * Math.PI * ((i % 360) / 360);
            const x = -speed*Math.sin(angle);
            const y = -speed*Math.cos(angle);
            const initx = 50*speed*Math.sin(angle);
            const inity = 50*speed*Math.cos(angle)-16;
            if (Math.floor(x*10) == 0 && Math.floor(y*10) == 0) 
                continue;
            const particle1 = new ColorParticle(asp, initx, inity, 55, x, y);
            drawables.addChild(particle1.sprite);
            particles.push(particle1);
        }

        return {
            drawables: drawables,
            respond: function() {;},
            update: function() {
                const toDelete = [];
                for (const index in particles) {
                    const p = particles[index];
                    p.update();
                    if (!p.active) {
                        drawables.removeChild(p.sprite);
                        toDelete.push(index);
                    }
                }
                toDelete.reverse();
                for (const delindex of toDelete) {
                    particles.splice(Number(delindex), 1);
                }
                if (particles.length == 0)
                    master.removeRunner(this);
            }
        };
    },
    getFallingAspect(master : Master, asp : Aspect) : Runner {
        const drawables = new PIXI.Container();
        const particles : ColorParticle[] = [];
        for (let i = -6; i < 6; i++) {
            const particle1 = new ColorParticle(asp, i, -16, 0, 0, 1);
            drawables.addChild(particle1.sprite);
            particles.push(particle1);
        }

        return {
            drawables: drawables,
            respond: function() {;},
            update: function() {
                for (const index in particles) {
                    const p = particles[index];
                    p.update();
                    if (p.y > 8)
                        p.reset();
                }
            }
        };
    },
}

class ColorParticle {
    public active : boolean = true;
    public sprite : PIXI.Sprite;

    private color : Aspect;
    private maxLifetime : number;
    private delta_x : number;
    private delta_y : number;
    private x_init : number;
    private y_init : number;

    private texture : PIXI.Texture;

    private lifetime : number = 0;

    get x()
    {
        return this.sprite.position.x;
    }

    get y()
    {
        return this.sprite.position.y;
    }

    constructor(color : Aspect, x : number, y : number, lifetime : number, delta_x : number, delta_y : number) {
        this.color = color;
        this.maxLifetime = lifetime;
        
        this.sprite = new PIXI.Sprite();
        this.sprite.position.x = x;
        this.sprite.position.y = y;
        this.x_init = x;
        this.y_init = y;
        this.delta_x = delta_x;
        this.delta_y = delta_y;

        this.texture = PIXI.Texture.from(PIXI.loader.resources['particle'].texture.baseTexture);        
        this.sprite.texture = this.texture;
        this.determineFrame();
    }

    private determineFrame() : void {
        const colorstep = this.maxLifetime == 0 ? Math.floor(3 * Math.abs(this.sprite.position.y / 8)) : Math.floor(3 * this.lifetime / this.maxLifetime);
        const rect = new PIXI.Rectangle(colorstep * 4, this.color * 4, 4, 4);
        this.texture.frame = rect;
    }

    reset()
    {
        this.sprite.position.x = this.x_init;
        this.sprite.position.y = this.y_init;
    }

    update() {
        if (this.maxLifetime != 0) {
            this.lifetime++;
            if (this.lifetime >= this.maxLifetime)
                this.active = false;
        }
        this.determineFrame();

        if (Math.random() > 0.1) {
            this.sprite.position.y += this.delta_y;
            this.sprite.position.x += this.delta_x;
        }
        if (Math.random() > 0.6 && this.sprite.position.x > -8 && this.sprite.position.x < 8)
            this.sprite.position.x += Math.random() > 0.5 ? 1 : -1;
    }
}