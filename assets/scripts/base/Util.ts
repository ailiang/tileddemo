
import { AnimationClip, Node, Sprite, SpriteAtlas, SpriteFrame, UITransform, animation, resources } from "cc";

export const CreateNode = ( name: string = ''):Node => {
    const n = new Node(name)
    const t = n.addComponent(UITransform)
    t.setAnchorPoint(0.5, 0.5)
    t.setContentSize(16,16)
    return n
}

export const loadClip = async (path: string): Promise<AnimationClip> => {
        return new Promise<AnimationClip>((resolve) => {
            resources.load(path, SpriteAtlas, (err, atlas) => {
                const frames = atlas.getSpriteFrames().sort(/*排序逻辑*/);
                const clip = createClip(frames, path);
                resolve(clip);
            });
        });
    }

export const createClip = (frames: SpriteFrame[], name: string = ''): AnimationClip => {
        const clip = new AnimationClip();
        clip.name = name 
        clip.duration = 1.0; // 总时长（秒）
        clip.wrapMode = AnimationClip.WrapMode.Loop; // 循环模式

    
        const track = new animation.ObjectTrack()
        track.path = new animation.TrackPath()
            .toComponent(Sprite)    // 目标组件
            .toProperty('spriteFrame'); // 目标属性

        // 生成关键帧数据
        const keyframes: Array<[number, SpriteFrame]> = frames.map((frame, index) => ([
            (index / frames.length) * clip.duration, // 时间点（均匀分布）
             frame
        ]));

        // 将关键帧添加到轨道
        track.channel.curve.assignSorted(keyframes);

        // 添加轨道到动画剪辑
        clip.addTrack(track);

        return clip;
    }

