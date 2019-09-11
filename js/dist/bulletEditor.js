/**
 * 标准键盘布局
 * ┌───┐   ┌───┬───┬───┬───┐ ┌───┬───┬───┬───┐ ┌───┬───┬───┬───┐ ┌───┬───┬───┐
 * │Esc│   │ F1│ F2│ F3│ F4│ │ F5│ F6│ F7│ F8│ │ F9│F10│F11│F12│ │P/S│S L│P/B│  ┌┐    ┌┐    ┌┐
 * └───┘   └───┴───┴───┴───┘ └───┴───┴───┴───┘ └───┴───┴───┴───┘ └───┴───┴───┘  └┘    └┘    └┘
 * ┌───┬───┬───┬───┬───┬───┬───┬───┬───┬───┬───┬───┬───┬───────┐ ┌───┬───┬───┐ ┌───┬───┬───┬───┐
 * ├───┴─┬─┴─┬─┴─┬─┴─┬─┴─┬─┴─┬─┴─┬─┴─┬─┴─┬─┴─┬─┴─┬─┴─┬─┴─┬─────┤ ├───┼───┼───┤ ├───┼───┼───┼───┤
 * │ Tab │ Q │ W │ E │ R │ T │ Y │ U │ I │ O │ P │{ [│} ]│ | \ │ │Del│End│PDn│ │ 7 │ 8 │ 9 │   │
 * ├─────┴┬──┴┬──┴┬──┴┬──┴┬──┴┬──┴┬──┴┬──┴┬──┴┬──┴┬──┴┬──┴─────┤ └───┴───┴───┘ ├───┼───┼───┤ + │
 * │ Caps │ A │ S │ D │ F │ G │ H │ J │ K │ L │: ;│" '│ Enter  │               │ 4 │ 5 │ 6 │   │
 * ├──────┴─┬─┴─┬─┴─┬─┴─┬─┴─┬─┴─┬─┴─┬─┴─┬─┴─┬─┴─┬─┴─┬─┴────────┤     ┌───┐     ├───┼───┼───┼───┤
 * │ Shift  │ Z │ X │ C │ V │ B │ N │ M │< ,│> .│? /│  Shift   │     │ ↑ │     │ 1 │ 2 │ 3 │   │
 * ├─────┬──┴─┬─┴──┬┴───┴───┴───┴───┴───┴──┬┴───┼───┴┬────┬────┤ ┌───┼───┼───┐ ├───┴───┼───┤ E││
 * │ Ctrl│    │Alt │         Space         │ Alt│    │    │Ctrl│ │ ← │ ↓ │ → │ │   0   │ . │←─┘│
 * └─────┴────┴────┴───────────────────────┴────┴────┴────┴────┘ └───┴───┴───┘ └───────┴───┴───┘
 */

let vm = new Vue({


    /*******************************************************************************************************************
     * el属性
     */
	el : '#shellEditor',


    /*******************************************************************************************************************
     * data属性
     */
	data : {
	    // 是否显示数据模板
        showBulletConfig : false,
	    // 炮弹
		BulletConfig : {},// 初始化炮弹配置
		tempId : null,// 炮弹id
        minScope : 1,
        maxScope : 1,
		
        // 为了存储炮弹图片spine的动画
        animations : [],
        fireAnimations : [],
		//
		buffConfig : [],

		// 为了显示
		nowIndex : {
			bullet : '0',
			cycle : '-1',
			trigger : '-1',
			effect : '-1'
		},
	},


    /*******************************************************************************************************************
     * computed属性
     */
    computed : {
        // can
        can : function () {
            return document.getElementById('canvas');
        },
        // ctx
        ctx : function () {
            return this.can.getContext('2d');
        },
    },


    /*******************************************************************************************************************
     * methods属性
     */
	methods : {

		// 打开编辑过的炮弹文件
        uploadTxt : function (e) {
		    // 变量
			let oEvent = e || window.event;
            let oFile = oEvent.target.files[0];
            let reader = new FileReader();
			let _this = this;
            // 判断是否传入文件
			if (!oFile) return;
            // 判断文件的格式
            let filename = oFile.name;
            if (cyber.getSuffix(filename) !== 'txt') {
                alert('文件名后缀应为：txt');
                return;
            }
            // 上传成功后
			// 清空
            this.BulletConfig = {};
            // 读取文件
			reader.readAsText(oFile, "utf-8");
            // 加载赋值
		    reader.onload = function () {
                // 赋值
		        _this.BulletConfig = _this.filterObj(JSON.parse(this.result));
			};
		    // 清空value
            oEvent.target.value = '';
		},


        /***************************************************************************************************************
         * 过滤上传txt文件中的obj对象，增删改查
         */
        filterObj : function (obj) {
            obj = this.filterFire(obj);// fire
            obj = this.filterFireAnimation(obj);// fireAnimation
            obj = this.filterPrivateFireAnimation(obj);// PrivateFireAnimation
            obj = this.filterPhysicsShape(obj);// physicsShape
            obj = this.filterBulletShape(obj);// bulletShape
            obj = this.filterOriginalShape(obj);// 删除shape"，"width"，"height"，"radius"
            obj = this.filterWeaponFire(obj);// bullets - weaponFire
            obj = this.filterWeaponSound(obj);// bullets - weaponSound
            obj = this.filterAnimations(obj);// 如果没有 _animations
            obj = this.filterSpineName(obj);// 添加spineName，animation
            obj = this.filterKeepPlay(obj);// bullets - keepPlay
            obj = this.filterFixedRotation(obj);// 添加fixedRotation
            obj = this.filterKeepJump(obj);// bullets - circles - keepJump
            obj = this.filterFlySound(obj);// bullets - circles - flySound
            obj = this.filterTrackSound(obj);// bullets - circles - trackSound
            obj = this.filterRollSound(obj);// bullets - circles - rollSound
            obj = this.filterJumpSound(obj);// bullets - circles - jumpSound
            obj = this.filterInfluenced(obj);// bullets - circles - influenced
            obj = this.filterEffectKeepPlay(obj);// bullets - circles - 触发结果 - 添加动画keepPlay
            return obj;
        },

        // 添加火焰
        filterFire : function (obj) {
            for (let i = 0; i < obj.bullets.length; i++) {
                if (!obj.bullets[i].fire) {
                    obj.bullets[i].fire = DEFAULT_BULLET_CONFIG.fire;
                }
            }
            return obj;
        },

        // 添加火焰动画
        filterFireAnimation : function (obj) {
            for (let i = 0; i < obj.bullets.length; i++) {
                if (!obj.bullets[i].fireAnimation) {
                    obj.bullets[i].fireAnimation = DEFAULT_BULLET_CONFIG.fireAnimation;
                }
            }
            return obj;
        },

        // 存储所有火焰动画
        filterPrivateFireAnimation : function (obj) {
            for (let i = 0; i < obj.bullets.length; i++) {
                if (!obj.bullets[i]._fireAnimations) {
                    obj.bullets[i]._fireAnimations = DEFAULT_BULLET_CONFIG._fireAnimations;
                }
            }
            return obj;
        },

        // physicsShape
        filterPhysicsShape : function (obj) {
            for (let i = 0; i < obj.bullets.length; i++) {
                if (!obj.bullets[i].physicsShape) {
                    obj.bullets[i].physicsShape = {
                        type : DEFAULT_BULLET_CONFIG.physicsShape.type,
                        radius : DEFAULT_BULLET_CONFIG.physicsShape.radius,// 3
                        width : DEFAULT_BULLET_CONFIG.physicsShape.width,// 4
                        height : DEFAULT_BULLET_CONFIG.physicsShape.height,// 4
                    }
                }
            }
            return obj;
        },

        // bulletShape
        filterBulletShape : function (obj) {
            for (let i = 0; i < obj.bullets.length; i++) {
                if (!obj.bullets[i].bulletShape) {
                    obj.bullets[i].bulletShape = {
                        type : DEFAULT_BULLET_CONFIG.bulletShape.type,
                        radius : DEFAULT_BULLET_CONFIG.bulletShape.radius,// 1
                        width : DEFAULT_BULLET_CONFIG.bulletShape.width,// 2
                        height : DEFAULT_BULLET_CONFIG.bulletShape.height,// 2
                        anchorX : DEFAULT_BULLET_CONFIG.bulletShape.anchorX,// 2
                        anchorY : DEFAULT_BULLET_CONFIG.bulletShape.anchorY,// 2
                    }
                }
            }
            return obj;
        },

        // 删除shape"，"width"，"height"，"radius"
        filterOriginalShape : function (obj) {
            for (let i = 0; i < obj.bullets.length; i++) {
                if (obj.bullets[i].hasOwnProperty('shape')) delete obj.bullets[i].shape;
                if (obj.bullets[i].hasOwnProperty('width')) delete obj.bullets[i].width;
                if (obj.bullets[i].hasOwnProperty('height')) delete obj.bullets[i].height;
                if (obj.bullets[i].hasOwnProperty('radius')) delete obj.bullets[i].radius;
            }
            return obj;
        },

        // 如果没有 weaponfire
        filterWeaponFire : function (obj) {
            if (!obj.weaponFire) obj.weaponFire = '';
            return obj;
        },

        // 如果没有 weaponfire
        filterWeaponSound : function (obj) {
            if (!obj.weaponSound) obj.weaponSound = '';
            return obj;
        },

        // 如果没有 _animations
        filterAnimations : function (obj) {
            for (let i = 0; i < obj.bullets.length; i++) {
                if (!obj.bullets[i]._animations) obj.bullets[i]._animations = DEFAULT_BULLET_CONFIG._animations;
            }
            return obj;
        },

        // 添加spineName，animation
        filterSpineName : function (obj) {
            for (let i = 0; i < obj.bullets.length; i++) {
                if (!obj.bullets[i].bulletShape || !obj.bullets[i].animation) {
                    obj.bullets[i].spineName = DEFAULT_BULLET_CONFIG.spineName;
                    obj.bullets[i].animation = DEFAULT_BULLET_CONFIG.animation;
                }
            }
            return obj;
        },

        // bullets - keepPlay
        filterKeepPlay : function (obj) {
            for (let i = 0; i < obj.bullets.length; i++) {
                if (obj.bullets[i].keepPlay === undefined) {
                    vm.$set(obj.bullets[i], 'keepPlay', DEFAULT_BULLET_CONFIG.keepPlay);
                }
            }
            return obj;
        },

        // bullets - cycles - influenced
        filterInfluenced :function (obj) {
            for (let i = 0; i < obj.bullets.length; i++) {
                for (let j = 0; j < obj.bullets[i].cycles.length; j++) {
                    if (obj.bullets[i].cycles[j].influenced === null) {
                        obj.bullets[i].cycles[j].influenced = DEFAULT_BULLET_CONFIG.cycles.influenced;
                    }
                }
            }
            return obj;
        },

        // bullets - cycles - keepJump（继续弹跳）
        filterKeepJump : function (obj) {
            for (let i = 0; i < obj.bullets.length; i++) {
                for (let j = 0; j < obj.bullets[i].cycles.length; j++) {
                    if (obj.bullets[i].cycles[j].keepJump === undefined) {
                        obj.bullets[i].cycles[j].keepJump = DEFAULT_BULLET_CONFIG.cycles.keepJump;
                    }
                }
            }
            return obj;
        },

        // bullets - cycles - fixedRotation
        filterFixedRotation : function (obj) {
            for (let i = 0; i < obj.bullets.length; i++) {
                for (let j = 0; j < obj.bullets[i].cycles.length; j++) {
                    if (obj.bullets[i].cycles[j].fixedRotation === undefined) {
                        obj.bullets[i].cycles[j].fixedRotation = DEFAULT_BULLET_CONFIG.cycles.fixedRotation;
                    }
                }
            }
            return obj;
        },


        // bullets - cycles - flySound（飞行音效）
        filterFlySound : function (obj) {
            for (let i = 0; i < obj.bullets.length; i++) {
                for (let j = 0; j < obj.bullets[i].cycles.length; j++) {
                    if (obj.bullets[i].cycles[j].flySound === undefined) {
                        obj.bullets[i].cycles[j].flySound = DEFAULT_BULLET_CONFIG.cycles.flySound;
                    }
                }
            }
            return obj;
        },

        // bullets - cycles - trackSound（跟踪音效）
        filterTrackSound : function (obj) {
            for (let i = 0; i < obj.bullets.length; i++) {
                for (let j = 0; j < obj.bullets[i].cycles.length; j++) {
                    if (obj.bullets[i].cycles[j].trackSound === undefined) {
                        obj.bullets[i].cycles[j].trackSound = DEFAULT_BULLET_CONFIG.cycles.trackSound;
                    }
                }
            }
            return obj;
        },

        // bullets - cycles - rollSound（滚动音效）
        filterRollSound : function (obj) {
            for (let i = 0; i < obj.bullets.length; i++) {
                for (let j = 0; j < obj.bullets[i].cycles.length; j++) {
                    if (obj.bullets[i].cycles[j].rollSound === undefined) {
                        obj.bullets[i].cycles[j].rollSound = DEFAULT_BULLET_CONFIG.cycles.rollSound;
                    }
                }
            }
            return obj;
        },

        // bullets - cycles - jumpSound（弹跳音效）
        filterJumpSound : function (obj) {
            for (let i = 0; i < obj.bullets.length; i++) {
                for (let j = 0; j < obj.bullets[i].cycles.length; j++) {
                    if (obj.bullets[i].cycles[j].jumpSound1 === undefined) {
                        obj.bullets[i].cycles[j].jumpSound1 = DEFAULT_BULLET_CONFIG.cycles.jumpSound1;
                    }
                    if (obj.bullets[i].cycles[j].jumpSound2 === undefined) {
                        obj.bullets[i].cycles[j].jumpSound2 = DEFAULT_BULLET_CONFIG.cycles.jumpSound2;
                    }
                    if (obj.bullets[i].cycles[j].jumpSound3 === undefined) {
                        obj.bullets[i].cycles[j].jumpSound3 = DEFAULT_BULLET_CONFIG.cycles.jumpSound3;
                    }
                    if (obj.bullets[i].cycles[j].jumpSound4 === undefined) {
                        obj.bullets[i].cycles[j].jumpSound4 = DEFAULT_BULLET_CONFIG.cycles.jumpSound4;
                    }
                }
            }
            return obj;
        },

        // bullets - cycles - triggers - effects - keepPlay（持续播放，添加动画）
        filterEffectKeepPlay : function (obj) {
            for (let i = 0; i < obj.bullets.length; i++) {
                for (let j = 0; j < obj.bullets[i].cycles.length; j++) {
                    for (let m = 0; m < obj.bullets[i].cycles[j].triggers.length; m++) {
                        for (let n = 0; n < obj.bullets[i].cycles[j].triggers[m].effects.length; n++) {

                            //
                            if (obj.bullets[i].cycles[j].triggers[m].effects[n].effectMode === 8) {
                                if (obj.bullets[i].cycles[j].triggers[m].effects[n].effectParams.animations === null
                                    || obj.bullets[i].cycles[j].triggers[m].effects[n].effectParams.keepPlay === null
                                ) {
                                    obj.bullets[i].cycles[j].triggers[m].effects[n].effectParams = {
                                        animation : '',
                                        keepPlay : true,
                                    }
                                }
                            }
                        }
                    }
                }
            }
            return obj;
        },


        /**
         *
         */
        // 创建新炮弹
        createNewBullet : function () {
			if (this.tempId === '') {
			    alert('还未输入炮弹ID哦！');
            } else {
			    if (this.tempId >= 1 && this.tempId <= 999999) {
                    this.BulletConfig = {
                        _id : this.tempId,
                        id : '',
                        _maxLevel : 1,
                        weaponFire : DEFAULT_BULLET_CONFIG.weaponFire,
                        weaponSound : DEFAULT_BULLET_CONFIG.weaponSound,
                        launchDuration : 0,
                        _bulletID : 1,
                        bullets : [],
                    };
                    // 清空临时id
                    this._id = '';
                } else {
			        alert('炮弹ID范围：1~999999');
                }
            }
		},

		// 添加弹头
		addBullet : function (bulletIndex, cycleIndex, triggerIndex, effectIndex, effectItem) {
            /**
             * 因为有两种情况：
             *      一：生成炮弹的时候添加弹头；
             *      二：触发结果 添加弹头；
             *      而bulletObj太长，所以要提出来；
             */
			let bulletObj = {
				id : this.BulletConfig._bulletID,
				// 自定义属性
				_bulletIndex : DEFAULT_BULLET_CONFIG._bulletIndex,// 必须是0，不能是-1
				_cycleIndex : DEFAULT_BULLET_CONFIG._cycleIndex,
				_triggerIndex : DEFAULT_BULLET_CONFIG._triggerIndex,
				_effectIndex : DEFAULT_BULLET_CONFIG._effectIndex,
				_cycleID : DEFAULT_BULLET_CONFIG._cycleID,
                // 炮弹png样式
                _imageType : DEFAULT_BULLET_CONFIG._imageType,
				image : DEFAULT_BULLET_CONFIG.image,
                spineName : DEFAULT_BULLET_CONFIG.spineName,
                _animations : DEFAULT_BULLET_CONFIG._animations,
                animation : DEFAULT_BULLET_CONFIG.animation,
                keepPlay : DEFAULT_BULLET_CONFIG.keepPlay,
                // 炮弹json样式
				wake : DEFAULT_BULLET_CONFIG.wake,
                fire : DEFAULT_BULLET_CONFIG.fire,
                _fireAnimations :DEFAULT_BULLET_CONFIG._fireAnimations,
                fireAnimation : DEFAULT_BULLET_CONFIG.fireAnimation,
                // 发射
				launchTime : DEFAULT_BULLET_CONFIG.launchTime,
				speed : DEFAULT_BULLET_CONFIG.speed,
				// 物理模型
                physicsShape : {
				    type : DEFAULT_BULLET_CONFIG.physicsShape.type,
                    radius : DEFAULT_BULLET_CONFIG.physicsShape.radius,
                    width : DEFAULT_BULLET_CONFIG.physicsShape.width,
                    height : DEFAULT_BULLET_CONFIG.physicsShape.height,
                },
                // 炮弹模型
                bulletShape : {
                    type : DEFAULT_BULLET_CONFIG.bulletShape.type,
                    radius : DEFAULT_BULLET_CONFIG.bulletShape.radius,
                    width : DEFAULT_BULLET_CONFIG.bulletShape.width,
                    height : DEFAULT_BULLET_CONFIG.bulletShape.height,
                    anchorX : DEFAULT_BULLET_CONFIG.bulletShape.anchorX,
                    anchorY : DEFAULT_BULLET_CONFIG.bulletShape.anchorY,
                },
                // 重量
				mass : DEFAULT_BULLET_CONFIG.mass,
				rotationMoment : DEFAULT_BULLET_CONFIG.rotationMoment,
                isFollowByCamera : DEFAULT_BULLET_CONFIG.isFollowByCamera,
				launched : DEFAULT_BULLET_CONFIG.launched,
                // 轨迹
				cycles : [{
					id : DEFAULT_BULLET_CONFIG.cycles.id,
					motionMode : DEFAULT_BULLET_CONFIG.cycles.motionMode,//运行轨迹 类型 ： 1飞行；2滚动；3弹跳；4粘着
					//1飞行
					isOffsetCoord : DEFAULT_BULLET_CONFIG.cycles.isOffsetCoord,
					x : DEFAULT_BULLET_CONFIG.cycles.x,	//❤默认值❤
					y : DEFAULT_BULLET_CONFIG.cycles.y,	//❤默认值❤
					isOffsetRotation : DEFAULT_BULLET_CONFIG.cycles.isOffsetRotation,
					rotation : DEFAULT_BULLET_CONFIG.cycles.rotation,
					isOffsetSpeed : DEFAULT_BULLET_CONFIG.cycles.isOffsetSpeed,//相对速度true; 绝对速度
					speed : DEFAULT_BULLET_CONFIG.cycles.speed,//速度 ❤默认值❤
                    influenced : DEFAULT_BULLET_CONFIG.cycles.influenced,// 是否受风力影响，默认true
					flyMode : DEFAULT_BULLET_CONFIG.cycles.flyMode,// 飞行模式: 1.是抛物线; 2.是直线
					flySound : DEFAULT_BULLET_CONFIG.cycles.flySound,// 飞行音效
					obstructionLoss : DEFAULT_BULLET_CONFIG.cycles.obstructionLoss,//阻力损失
					rotateMode : DEFAULT_BULLET_CONFIG.cycles.rotateMode,//1.不旋转; 2.自旋转; 3.跟随轨迹旋转，4.固定
                    fixedRotation : DEFAULT_BULLET_CONFIG.cycles.fixedRotation,
					// 是否-跟踪
					isTrack : DEFAULT_BULLET_CONFIG.cycles.isTrack,// true触发；false否
                    trackSound : DEFAULT_BULLET_CONFIG.cycles.trackSound,// 跟踪音乐
					trackRange : DEFAULT_BULLET_CONFIG.cycles.trackRange,// 大于0的数值
					trackAngle : DEFAULT_BULLET_CONFIG.cycles.trackAngle,// 大于0小于360
					trackTarget : DEFAULT_BULLET_CONFIG.cycles.trackTarget,// 1 友方,2 敌方,3 双方
					// 2.滚动
                    rollSound : DEFAULT_BULLET_CONFIG.cycles.rollSound,// 滚动音效
					rollDistence : DEFAULT_BULLET_CONFIG.cycles.rollDistence,// 滚动距离
					rollSpeed : DEFAULT_BULLET_CONFIG.cycles.rollSpeed,// 滚动速度
					// 3.弹跳
					elasticityLoss : DEFAULT_BULLET_CONFIG.cycles.elasticityLoss,// 弹力损失
                    keepJump : DEFAULT_BULLET_CONFIG.cycles.keepJump,// 是否继续弹跳
                    jumpSound1 : DEFAULT_BULLET_CONFIG.cycles.jumpSound1,// 弹跳音效1
                    jumpSound2 : DEFAULT_BULLET_CONFIG.cycles.jumpSound2,// 弹跳音效2
                    jumpSound3 : DEFAULT_BULLET_CONFIG.cycles.jumpSound3,// 弹跳音效3
                    jumpSound4 : DEFAULT_BULLET_CONFIG.cycles.jumpSound4,// 弹跳音效4
					// 4.粘着
					//无选项
                    // 5.激光
                    penetrate : DEFAULT_BULLET_CONFIG.cycles.penetrate,
                    // 触发
					triggers : [{
						triggerMode : DEFAULT_BULLET_CONFIG.cycles.triggers.triggerMode,//触发条件 类型： 1时间，2距离，3接触地面，4接触战车 5制定位置
						triggerParams : DEFAULT_BULLET_CONFIG.cycles.triggers.triggerParams,
						effects : [{
							//触发结果改变的临时变量
							_tempEffectMode : 0,
							effectMode : DEFAULT_BULLET_CONFIG.cycles.triggers.effects.effectMode,//1.新轨迹； 2.效果值 ；3.buff；4.破坏地形；5.美术；6.添加新子弹	；7.END；
							effectParams : DEFAULT_BULLET_CONFIG.cycles.triggers.effects.effectParams,//'nil'
						}],
					}],
				}],
			};

			switch (arguments.length) {
				// 若不传参,也就是开始生成的弹头
				case 0 :
                    // 什么都不做
					break;

				// 若传参,也就是触发结果 动态生成的弹头;从而在所生成弹头的触发结果里面显示.
				case 4 :
				    // 要给出索引，方便判断
					bulletObj._bulletIndex = bulletIndex;
					bulletObj._cycleIndex = cycleIndex;
					bulletObj._triggerIndex = triggerIndex;
					bulletObj._effectIndex = effectIndex;
					bulletObj._createdBy =  this.BulletConfig.bullets[bulletIndex].id;
					bulletObj.launched = false;
					this.BulletConfig.bullets[bulletIndex].cycles[cycleIndex].triggers[triggerIndex].effects[effectIndex].effectParams.push(this.BulletConfig._bulletID);
					break;

				default :
				    break;
			}
			this.BulletConfig.bullets.push(bulletObj);
			// 临时ID自增
			this.BulletConfig._bulletID++;
		},
        
        // 刷新
        refreshBulletConfig : function () {
            // 清空炮弹配置
            this.BulletConfig = {};
        },

		// 事件获取duration，我觉得应该有数据自获取方法
		getDuration : function () {
			let arr = [];
            let maxNum;
			// 因为开始并不存在，所以要先判断有没有弹头；如果有，才开始计算sum；
			if (this.BulletConfig.hasOwnProperty('bullets') && this.BulletConfig.bullets.length !== 0) {
				for (let i = 0, len = this.BulletConfig.bullets.length; i < len; i++) {
					if (this.BulletConfig.bullets[i].launched === true) {
                        let IntNum = parseFloat(this.BulletConfig.bullets[i].launchTime);
						arr.push(IntNum);
					}
				}
			}
			maxNum = _.max(arr);
			this.BulletConfig.launchDuration = maxNum;
		},

		// 树结构，收缩
		treeShrink : function (e) {
			let nodes = e.target.parentNode.parentNode.children;
			if (e.target.className === 'glyphicon glyphicon-menu-down') {
				e.target.className = 'glyphicon glyphicon-menu-right';
				for (let i = 0, len = nodes.length; i < len; i++) {
					if(nodes[i].nodeName === 'UL'){
						nodes[i].style.display = 'none';
					}
				}
			} else {
				e.target.className = 'glyphicon glyphicon-menu-down';
				for (let i = 0, len = nodes.length; i < len; i++) {
					if (nodes[i].nodeName === 'UL') {
						nodes[i].style.display = 'block';
					}
				}
			}
		},

		// 树结构选择内容：
		treeSwitch : function (bulletIndex, cycleIndex, triggerIndex, effectIndex, e) {
			//tab
			let oEvent = e || window.event;
			let aTreeLink = document.getElementsByClassName('treeLink');
			for (let i = 0, len = aTreeLink.length; i < len; i++) {
				aTreeLink[i].style.background = '';
			}
            oEvent.target.style.background = 'rgb(217, 237, 247)';
			//显示
			this.nowIndex = {
				bullet : bulletIndex,
				cycle : cycleIndex,
				trigger : triggerIndex,
				effect : effectIndex,
			};
		},
        
        // 改变炮弹图片
        bulletImageChange : function (bulletItem, type) {
            bulletItem._imageType = type;
            // 清空图片
            bulletItem.image = '';
            // 清空动画
            bulletItem.spineName = '';
            bulletItem.animation = '';
            bulletItem.keepPlay = true;
        },
    
        // 弹头物理样式改变
        bulletPhysicsShapeChange : function (bulletItem, type) {
            if (type === 0) {
                bulletItem.physicsShape = '';
            }
            else {
                // 先清空
                bulletItem.physicsShape = {
                    type : DEFAULT_BULLET_CONFIG.physicsShape.type,
                    radius : DEFAULT_BULLET_CONFIG.physicsShape.radius,
                    width : DEFAULT_BULLET_CONFIG.physicsShape.width,
                    height : DEFAULT_BULLET_CONFIG.physicsShape.height
                };
                // 枚举
                bulletItem.physicsShape.type = type;
            }
        },
        
		// 弹头样式改变选择
		bulletShapeChange : function (bulletItem, type) {
            if (type === 0) {
                bulletItem.bulletShape = '';
            }
            else if (type === 2 || type === 3) {
                // 先清空
                bulletItem.bulletShape = {
                    type : DEFAULT_BULLET_CONFIG.bulletShape.type,
                    radius : DEFAULT_BULLET_CONFIG.bulletShape.radius,
                    width : DEFAULT_BULLET_CONFIG.bulletShape.width,
                    height : DEFAULT_BULLET_CONFIG.bulletShape.height,
                    anchorX : DEFAULT_BULLET_CONFIG.bulletShape.anchorX,
                    anchorY : DEFAULT_BULLET_CONFIG.bulletShape.anchorY,
                };
                // 枚举
                bulletItem.bulletShape.type = type;
            }
            else if (type === 5) {
                // 先清空
                bulletItem.bulletShape = {
                    type : DEFAULT_BULLET_CONFIG.bulletShape.type,
                    radius : DEFAULT_BULLET_CONFIG.bulletShape.radius,
                    width : DEFAULT_BULLET_CONFIG.bulletShape.width,
                    height : DEFAULT_BULLET_CONFIG.bulletShape.height,
                    anchorX : '',
                    anchorY : '',
                };
                // 枚举
                bulletItem.bulletShape.type = type;
            }
		},
        
        // 画canvas
        drawCanvas : function (bulletItem, bulletIndex) {
            let idName = 'bullet' + bulletIndex;
            let can = document.getElementById(idName);
            let ctx = can.getContext('2d');
            can.width = 340;
            can.height = 340;
            /**
             * 变量
             */
            // 中心点
            let centerX = can.width/2;
            let centerY = can.height/2;
            // 物理
            let physicsType = bulletItem.physicsShape.type || 0;
            let physicsRadius = bulletItem.physicsShape.radius || 0;
            let physicsWidth = bulletItem.physicsShape.width || 0;
            let physicsHeight = bulletItem.physicsShape.height || 0;
            // 弹头
            let bulletType = bulletItem.bulletShape.type || 0;
            let bulletRadius = Math.floor(bulletItem.bulletShape.radius) || 0;
            let bulletWidth = Math.floor(bulletItem.bulletShape.width) || 0;
            let bulletHeight = bulletItem.bulletShape.height || 0;
            let bulletAnchorX = bulletItem.bulletShape.anchorX || 0.5;
            let bulletAnchorY = bulletItem.bulletShape.anchorY || 0.5;
            
            /**
             * 方法
             */
            show ();
            function show () {
                ctx.clearRect(0, 0, can.width, can.height);
                drawPhysics();
                drawBullet();
            }
            
            function drawPhysics () {
                switch (physicsType) {
                    case 1 :
                        alert('还没有画线的方法');
                        break;
        
                    case 2 :
                        drawHollowRect(centerX-physicsWidth/2, centerY-physicsHeight/2, physicsWidth, physicsHeight, 5, 'yellowgreen');
                        break;
        
                    case 3 :
                        drawHollowCircle(centerX, centerY, physicsRadius, 5, 'yellowgreen');
                        break;
        
                    case 4 :
                        drawCircle(centerX, centerY, 5, 'yellowgreen');
                        break;
                    default :
                    
                }
            }
    
            function drawBullet () {
                switch (bulletType) {
                    case 1 :
                        drawHollowCircle(centerX + bulletRadius, centerY - bulletRadius, bulletRadius, 1, 'red', bulletAnchorX, bulletAnchorY);
                        break;
                    case 2 :
                        drawHollowRect(centerX, centerY-bulletHeight, bulletWidth, bulletHeight, 1, 'red', bulletAnchorX, bulletAnchorY);
                        break;
                    default :
                    
                }
            }
            
            // 画实心圆
            function drawCircle (x, y, radius, color) {
                // 传参
                color = color || '#000000';
                // 画
                ctx.beginPath();
                ctx.fillStyle = color;
                ctx.arc(x, y, radius, 0, 2 * Math.PI);
                ctx.fill();
                ctx.closePath();
            }
            
            // 画空心圆
            function drawHollowCircle (x, y, radius, lineWidth, color, anchorX, anchorY) {
                // 传参
                color = color || '#000000';
                translateX = -anchorX * radius * 2 || 0;
                translateY = anchorY * radius * 2 || 0;
                // 画
                ctx.beginPath();
                ctx.strokeStyle = color;
                ctx.lineWidth = lineWidth;
                ctx.translate(translateX,translateY);
                ctx.arc(x, y, radius, 0, 2 * Math.PI);
                ctx.stroke();
                ctx.closePath();
                ctx.translate(0,0);
            }
            
            // 方
            function drawHollowRect (x, y, w, h, lineWidth, color, anchorX, anchorY) {
                // 传参
                color = color || "#f00";
                translateX = -anchorX * w || 0;
                translateY = anchorY * h || 0;
                // 画
                ctx.beginPath();
                ctx.translate(translateX,translateY);
                ctx.lineWidth = lineWidth;
                ctx.strokeStyle = color;
                ctx.strokeRect(x, y, w, h);
                
                ctx.closePath();
                ctx.translate(0,0);
            }
        },

        /***************************************************************************************************************
         * 打开文件
         */


        /**
         * 加载
         * @param item 对象
         * @param key  键
         * @param fileType 文件类型
         * @param e    事件
         */
        addFilename : function (item, key, fileType, e) {
            // 变量
            let oEvent = e || window.event;
            let oFile = oEvent.target.files[0];
            let lastFileName = '';// 存储最终文件名
            // 判断是否上传文件
            if (!oFile) return;
            // 判断文件的格式
            let filename = oFile.name;

            // 判断类型
            switch (fileType) {
                case 'json' :
                    if (cyber.getSuffix(filename) !== 'json') {
                        alert('文件名后缀应为：json');
                        return;
                    }
                    lastFileName = cyber.deleteSuffix(filename);
                    break;

                case 'plist' :
                    if (cyber.getSuffix(filename) !== 'plist') {
                        alert('文件名后缀应为：plist');
                        return;
                    }
                    lastFileName = cyber.deleteSuffix(filename);
                    break;

                case 'png' :
                    if (cyber.getSuffix(filename) !== 'png') {
                        alert('文件名后缀应为：png');
                        return;
                    }
                    lastFileName = filename;
                    break;

                case 'mp3' :
                    if (cyber.getSuffix(filename) !== 'mp3') {
                        alert('文件名后缀应为：mp3');
                        return;
                    }
                    lastFileName = filename;
                    break;

                default :
                    alert('未知类型');
                    break;
            }
            // 删除文件名后缀并赋值
            item[key] = lastFileName;
            // 清空
            oEvent.target.value = '';
        },

        // 删除属性值
        deleteFilename : function (item, key) {
            item[key] = '';
        },

        // 打开炮弹动画
        openSpineOfBullet : function (bulletIndex, e) {
		    let _this = this;
            let oEvent = e || window.event;
            let oFile = oEvent.target.files[0];
            // 判断是否上传文件
            if (!oFile) return;
            // 判断文件的格式
            let filename = oFile.name;
            if (cyber.getSuffix(filename) !== 'json') {
                alert('文件名后缀应为：json');
                return;
            }
            // 赋值
            this.BulletConfig.bullets[bulletIndex].spineName = cyber.deleteSuffix(filename);
            // 读取内容
            let reader = new FileReader();
            reader.readAsText(oFile, 'utf-8');
            
            reader.onload = function () {
                // 清空
                _this.BulletConfig.bullets[bulletIndex]._animations = [];
                // 获取
                let obj = JSON.parse(this.result);
                let animations = obj.animations;
                for (k in animations) {
                    if (animations.hasOwnProperty(k)) {
                        _this.BulletConfig.bullets[bulletIndex]._animations.push(k);
                    }
                }
            };
            // 清空value
            oEvent.target.value = '';
        },

        // 删除炮弹动画
        deleteSpineOfBullet : function (bulletIndex) {
            this.BulletConfig.bullets[bulletIndex].spineName = '';
            this.BulletConfig.bullets[bulletIndex].animations = '';
            this.BulletConfig.bullets[bulletIndex]._animations = [];
        },

        // 打开火焰json
        openJSONOfFire : function (bulletIndex, e) {
            let _this = this;
            let oEvent = e || window.event;
            let oFile = oEvent.target.files[0];
            // 判断是否上传文件
            if (!oFile) return;
            // 判断文件的格式
            let filename = oFile.name;
            if (cyber.getSuffix(filename) !== 'json') {
                alert('文件名后缀应为：json');
                return;
            }
            // 赋值
            this.BulletConfig.bullets[bulletIndex].fire = cyber.deleteSuffix(filename);
            // 读取内容
            let reader = new FileReader();
            reader.readAsText(oFile, 'utf-8');

            reader.onload = function () {
                // 清空
                _this.BulletConfig.bullets[bulletIndex]._fireAnimations = [];
                // 获取
                let obj = JSON.parse(this.result);
                let animations = obj.animations;
                for (k in animations) {
                    if (animations.hasOwnProperty(k)) {
                        _this.BulletConfig.bullets[bulletIndex]._fireAnimations.push(k);
                    }
                }
            };
            // 清空value
            oEvent.target.value = '';
        },

        // 删除火焰json
        deleteJSONOfFire : function (bulletIndex) {
            this.BulletConfig.bullets[bulletIndex].fire = '';
            this.BulletConfig.bullets[bulletIndex].fireAnimation = '';
            this.BulletConfig.bullets[bulletIndex]._fireAnimations = [];
        },

        // 打开破坏外形
        openImageOfDestroyedShape : function (effectItem, e) {
            let oEvent = e || window.event;
            let oFile = oEvent.target.files[0];
            let reader = new FileReader();
            let _this = this;
            // 判断是否上传文件
            if (!oFile) return;
            // 文件名
            let filename = oFile.name;
            // 判断文件的格式
            if (cyber.getSuffix(filename) !== 'png') {
                alert('文件名后缀应为：png');
                return;
            }
            // 赋值图片名称
            effectItem.effectParams.destroyShape = filename;
            // 读取文件信息
            reader.readAsDataURL(oFile);
            reader.onload = function () {

                let edge = new cyber.PNGEdge({
                    src : this.result,
                    alpha : 222,
                    thresholdValue : 1
                });
                // 加载完毕后
                edge.imageLoaded(function () {
                    let h = edge.imageHeight;
                    let arr = edge.allConvexPoints;
                    effectItem.effectParams.destroyPoints = _this.changeCoordinateSystemToLUA(arr, h);
                });
            };
            // 清空
            oEvent.target.value = '';
        },

        /**
         * 转换lua坐标系
         */
        changeCoordinateSystemToLUA : function (arr, h) {
            let newArr = [];// 存储
            arr.forEach(function (item) {
                newArr.push({
                    x : item.x,
                    y : h - item.y
                })
            });
            return newArr;
        },

        // 删除破坏外形
        deleteImageOfDestroyedShape : function (effectItem) {
            effectItem.effectParams.destroyShape = '';
            effectItem.effectParams.destroyPoints = [];
        },


        /*↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓破坏地形算坐标↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓*/
        /*↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓canvas↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓*/
        // canvas清空
        clearCanvas : function () {
            this.ctx.clearRect(0, 0, this.can.width, this.can.height);
        },

        // canvas矩形
        drawRect : function (x, y, w, h, color) {
            this.ctx.beginPath();
            this.ctx.fillStyle = color;
            this.ctx.fillRect(x, y, w, h);
            this.ctx.fill();
            this.ctx.closePath();
        },
		
        // 画坐标点
        drawCoordinary : function (arr) {
            let _this = this;
            arr.forEach(function(item, index) {
                _this.drawRect(item.x, item.y, _this.wh, _this.wh, _this.color);
            });
        },

		/*↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓验证↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓*/
		// 树结构，运动轨迹提醒
		cycleHint : function(cycleItem) {
			// 第一个轨迹i不是动态触发结果创建的，所以没有传参
			if (cycleItem.hasOwnProperty('_cycleSwitchIndex') === false) {
				alert('非动态生成的轨迹');
				return;
			}
            //
            let bIndex = cycleItem._cycleSwitchIndex.charAt(0);
            let cIndex = cycleItem._cycleSwitchIndex.charAt(1);
            let tIndex = cycleItem._cycleSwitchIndex.charAt(2);
            let eIndex = cycleItem._cycleSwitchIndex.charAt(3);
            //
            let triggerTarget = document.getElementById('trigger' + bIndex + cIndex + tIndex);
            let effectTarget = document.getElementById('effect' + bIndex + cIndex + tIndex + eIndex);
			triggerTarget.style.background = 'greenyellow';
			effectTarget.style.background = 'greenyellow';
			
			setTimeout(function () {
				triggerTarget.style.background = '';
				effectTarget.style.background = '';
			}, 2000)
		},
		
		// 添加运动轨迹
		addCycle : function (bulletIndex, cycleIndex, triggerIndex, effectIndex) {
			// 为了运动轨迹和触发结果的相互查找功能,所以要添加一个自定义属性,才能彼此查找
			let cycleSwitchIndex = bulletIndex.toString() + cycleIndex.toString() + triggerIndex.toString() + effectIndex.toString();
			
			this.BulletConfig.bullets[bulletIndex].cycles.push({
				id : this.BulletConfig.bullets[bulletIndex]._cycleID,
				_cycleSwitchIndex : cycleSwitchIndex,
				isOffsetCoord : DEFAULT_BULLET_CONFIG.cycles.isOffsetCoord,
				x : DEFAULT_BULLET_CONFIG.cycles.x, // ❤默认值❤
				y : DEFAULT_BULLET_CONFIG.cycles.y, // ❤默认值❤
				isOffsetRotation : DEFAULT_BULLET_CONFIG.cycles.isOffsetRotation,
				rotation : DEFAULT_BULLET_CONFIG.cycles.rotation,
				isOffsetSpeed : DEFAULT_BULLET_CONFIG.cycles.isOffsetSpeed, // 相对速度true；绝对速度
				speed : DEFAULT_BULLET_CONFIG.cycles.speed,	// ❤默认值❤
				motionMode : DEFAULT_BULLET_CONFIG.cycles.motionMode,
				//飞行
				flyMode : DEFAULT_BULLET_CONFIG.cycles.flyMode,
                flySound : DEFAULT_BULLET_CONFIG.cycles.flySound,
				rotateMode : DEFAULT_BULLET_CONFIG.cycles.rotateMode,
                fixedRotation : DEFAULT_BULLET_CONFIG.cycles.fixedRotation,
				obstructionLoss : DEFAULT_BULLET_CONFIG.cycles.obstructionLoss,// 两个地方可以修改
				// 是否-跟踪
				isTrack : DEFAULT_BULLET_CONFIG.cycles.isTrack, //true 触发；；false 否
                trackSound : DEFAULT_BULLET_CONFIG.cycles.trackSound,// 跟踪音乐
				trackRange : DEFAULT_BULLET_CONFIG.cycles.trackRange, // 大于0 的数值；
				trackAngle : DEFAULT_BULLET_CONFIG.cycles.trackAngle,// 大于0 小于 360；
				trackTarget : DEFAULT_BULLET_CONFIG.cycles.trackTarget, // 1-友方 ，2 敌方 ， 3 双方
				// 2滚动
                rollSound : DEFAULT_BULLET_CONFIG.cycles.rollSound,// 滚动距离
				rollDistence : DEFAULT_BULLET_CONFIG.cycles.rollDistence,// 滚动距离
				rollSpeed : DEFAULT_BULLET_CONFIG.cycles.rollSpeed,// 滚动速度
				// 3弹跳
				elasticityLoss : DEFAULT_BULLET_CONFIG.cycles.elasticityLoss,// 弹力损失；每一秒中； 0~1；默认值为0
                keepJump : DEFAULT_BULLET_CONFIG.cycles.keepJump,
                jumpSound1 : DEFAULT_BULLET_CONFIG.cycles.jumpSound1,
                jumpSound2 : DEFAULT_BULLET_CONFIG.cycles.jumpSound2,
                jumpSound3 : DEFAULT_BULLET_CONFIG.cycles.jumpSound3,
                jumpSound4 : DEFAULT_BULLET_CONFIG.cycles.jumpSound4,
				//obstructionLoss : 0,// 阻力损失；每弹跳一次的损失 ; 默认值为0
				// 4粘着
				//无选项
                // 5激光
                penetrate : DEFAULT_BULLET_CONFIG.cycles.penetrate,
				triggers : [{
					triggerMode : DEFAULT_BULLET_CONFIG.cycles.triggers.triggerMode,
					triggerParams : DEFAULT_BULLET_CONFIG.cycles.triggers.triggerParams,
					effects : [{
						effectMode : DEFAULT_BULLET_CONFIG.cycles.triggers.effects.effectMode,
						effectParams : DEFAULT_BULLET_CONFIG.cycles.triggers.effects.effectParams,
					}],
				}],
			});
			// 临时ID自增
			this.BulletConfig.bullets[bulletIndex]._cycleID++;
		},

		// 添加触发条件
		addTrigger : function (bulletIndex, cycleIndex) {
			this.BulletConfig.bullets[bulletIndex].cycles[cycleIndex].triggers.push({
				triggerMode : DEFAULT_BULLET_CONFIG.cycles.triggers.triggerMode,
				triggerParams : DEFAULT_BULLET_CONFIG.cycles.triggers.triggerParams,
				effects : [{
					effectMode : DEFAULT_BULLET_CONFIG.cycles.triggers.effects.effectMode,
					effectParams : DEFAULT_BULLET_CONFIG.cycles.triggers.effects.effectParams,
				}]
			});
		},

		// 添加结果：
		addEffect : function (bulletIndex, cycleIndex, triggerIndex) {
			this.BulletConfig.bullets[bulletIndex].cycles[cycleIndex].triggers[triggerIndex].effects.push({
				effectMode : DEFAULT_BULLET_CONFIG.cycles.triggers.effects.effectMode,
				effectParams : DEFAULT_BULLET_CONFIG.cycles.triggers.effects.effectParams,
			});
		},

		// 删除发射弹头
		deleteBulletOne : function(bulletItem, bulletIndex) {
			for (let j = 0, lenj = bulletItem.cycles.length; j < lenj; j++) {
				for (let r = 0, lenr = bulletItem.cycles[j].triggers.length; r < lenr; r++) {
					for (let x = 0, lenx = bulletItem.cycles[j].triggers[r].effects.length; x < lenx; x++) {
						if (bulletItem.cycles[j].triggers[r].effects[x].effectMode === 6) {
                            let arrParams = bulletItem.cycles[j].triggers[r].effects[x].effectParams;
							if (arrParams.length !== 0) {
								alert('有生成的弹头，不能删除');
								return;
							}
						}
					}
				}
			}
			let confirm = window.confirm("可以删除，确认删除吗？");
			if (confirm) {
				this.BulletConfig.bullets.splice(bulletIndex, 1);
				this.getDuration();
			}
		},
		
		// 删除生成弹头
		deleteBullet : function (bulletID , effectItem) {
            let confirm = window.confirm('确认删除 弹头' + bulletID + '吗？');
			if (confirm) {
				//删除effectParams
				for (let i = 0 ,len = effectItem.effectParams.length ; i < len ; i++) {
					if (effectItem.effectParams[i] === bulletID) effectItem.effectParams.splice(i, 1);
				}
				//删除弹头
				for (let i = 0, len = this.BulletConfig.bullets.length; i < len; i++) {
					if (this.BulletConfig.bullets[i].id === bulletID) {// ❤❤❤❤ ：[id]不能写成 .id。要报错；
						this.BulletConfig.bullets.splice(i,1);
					}
				}
			}
		},
		
		// 删除触发
		deleteTrigger : function (bulletIndex, cycleIndex, triggerIndex) {
            let aItem = this.BulletConfig.bullets[bulletIndex].cycles[cycleIndex].triggers[triggerIndex].effects;
			for (let i = 0, len = aItem.length; i < len; i++) {
				//console.log(aItem[i].effectMode === 6 && aItem[i].effectParams.length !== 0);
				if (aItem[i].effectMode === 6 && aItem[i].effectParams.length !== 0) {
					alert('有动态生成元素，请先删除！');
					return;
				}
			}
			// 判断完成后执行
            let confirm = window.confirm("确认删除【弹头"+(bulletIndex+1)+"】【轨迹"+(cycleIndex+1)+"】【触发"+(triggerIndex+1)+"】吗？");
			if (confirm) this.BulletConfig.bullets[bulletIndex].cycles[cycleIndex].triggers.splice(triggerIndex, 1);
		},

		// 删除结果
		deleteEffect : function (bulletIndex, cycleIndex, triggerIndex, effectIndex) {
		    // 检查当前索引的触发条件，是否创建了炮弹
			if (this.BulletConfig.bullets[bulletIndex].cycles[cycleIndex].triggers[triggerIndex].effects[effectIndex].effectMode === 6) {
				if (this.BulletConfig.bullets[bulletIndex].cycles[cycleIndex].triggers[triggerIndex].effects[effectIndex].effectParams.length !== 0) {
					alert("有生成的弹头，不能删除，请先删除创建的炮弹");
					return;
				}
			}

            // 判断完成后执行
            let confirm = window.confirm("确认删除【弹头"+(bulletIndex+1)+"】【轨迹"+(cycleIndex+1)+"】【触发"+(triggerIndex+1)+"】【结果【"+(effectIndex+1)+"】吗？");
            if (confirm) {
                // 检查大于当前索引的触发条件，是否创建了炮弹，如果有，则要更改索引
                for (let i = effectIndex+1; i < this.BulletConfig.bullets[bulletIndex].cycles[cycleIndex].triggers[triggerIndex].effects.length; i++) {
                    if (this.checkBulletBeforeEffectChange(bulletIndex, cycleIndex, triggerIndex, i) !== 0) {
                        for (let j = 0; j < this.BulletConfig.bullets.length; j++) {

                            if (
                                this.BulletConfig.bullets[j]._bulletIndex === bulletIndex &&
                                this.BulletConfig.bullets[j]._cycleIndex === cycleIndex &&
                                this.BulletConfig.bullets[j]._triggerIndex === triggerIndex &&
                                this.BulletConfig.bullets[j]._effectIndex === i
                            ) {
                                this.BulletConfig.bullets[j]._effectIndex = i - 1;
                            }
                        }
                    }
                }
                // 删除
                this.BulletConfig.bullets[bulletIndex].cycles[cycleIndex].triggers[triggerIndex].effects.splice(effectIndex, 1);
            }
		},
		
		// 选择触发结果
		effectSwitch : function (effectIndex, e) {
			let oEvent = e || window.event;
			this.nowIndex.effect = effectIndex;
			
			let aEffectSwitch = document.getElementsByClassName('effectSwitch');
			
			for (let i = 0, len = aEffectSwitch.length; i < len; i++) {
				//aEffectSwitch[i].style.background = '#d9edf7';
				aEffectSwitch[i].className = 'btn btn-sm btn-warning effectSwitch';
			}
            oEvent.target.className = 'btn btn-sm btn-warning effectSwitch active';
		},

		// 运动轨迹类型选择
		motionModeChange : function (cycleItem) {
			// 切换一次，就要清空之前填错的内容
			cycleItem.isOffsetCoord = DEFAULT_BULLET_CONFIG.cycles.isOffsetCoord;
			cycleItem.x = DEFAULT_BULLET_CONFIG.cycles.x;
			cycleItem.y = DEFAULT_BULLET_CONFIG.cycles.y;
			cycleItem.isOffsetRotation = DEFAULT_BULLET_CONFIG.cycles.isOffsetRotation;
			cycleItem.rotation = DEFAULT_BULLET_CONFIG.cycles.rotation;
			cycleItem.isOffsetSpeed = DEFAULT_BULLET_CONFIG.cycles.isOffsetSpeed;
			cycleItem.speed = DEFAULT_BULLET_CONFIG.cycles.speed;
            cycleItem.influenced = DEFAULT_BULLET_CONFIG.cycles.influenced;
			cycleItem.flyMode = DEFAULT_BULLET_CONFIG.cycles.flyMode;
			cycleItem.flySound = DEFAULT_BULLET_CONFIG.cycles.flySound;
			cycleItem.obstructionLoss = DEFAULT_BULLET_CONFIG.cycles.obstructionLoss;
			cycleItem.rotateMode = DEFAULT_BULLET_CONFIG.cycles.rotateMode;
            cycleItem.fixedRotation = DEFAULT_BULLET_CONFIG.cycles.fixedRotation;
			
			// 是否 - 跟踪
			cycleItem.isTrack = DEFAULT_BULLET_CONFIG.cycles.isTrack;
            cycleItem.trackSound = DEFAULT_BULLET_CONFIG.cycles.trackSound;
			cycleItem.trackRange = DEFAULT_BULLET_CONFIG.cycles.trackRange;
			cycleItem.trackAngle = DEFAULT_BULLET_CONFIG.cycles.trackAngle;
			cycleItem.trackTarget = DEFAULT_BULLET_CONFIG.cycles.trackTarget;
			
			// 2滚动
            cycleItem.rollSound = DEFAULT_BULLET_CONFIG.cycles.rollSound;
			cycleItem.rollDistence = DEFAULT_BULLET_CONFIG.cycles.rollDistence;
			cycleItem.rollSpeed = DEFAULT_BULLET_CONFIG.cycles.rollSpeed;
			
			// 3弹跳
			cycleItem.elasticityLoss = DEFAULT_BULLET_CONFIG.cycles.elasticityLoss;
			cycleItem.obstructionLoss = DEFAULT_BULLET_CONFIG.cycles.obstructionLoss;
            cycleItem.keepJump = DEFAULT_BULLET_CONFIG.cycles.keepJump;
            cycleItem.jumpSound1 = DEFAULT_BULLET_CONFIG.cycles.jumpSound1;
            cycleItem.jumpSound2 = DEFAULT_BULLET_CONFIG.cycles.jumpSound2;
            cycleItem.jumpSound3 = DEFAULT_BULLET_CONFIG.cycles.jumpSound3;
            cycleItem.jumpSound4 = DEFAULT_BULLET_CONFIG.cycles.jumpSound4;

			// 4粘着
			// 无内容
            
            // 5激光
            cycleItem.penetrate = DEFAULT_BULLET_CONFIG.cycles.penetrate;
		},
        
        // 切换 - 是否跟踪
        trackModeChange : function (cycleItem, isTrack) {
		    // 恢复默认值
            cycleItem.trackSound = DEFAULT_BULLET_CONFIG.cycles.trackSound;
            cycleItem.trackRange = DEFAULT_BULLET_CONFIG.cycles.trackRange;
            cycleItem.trackAngle = DEFAULT_BULLET_CONFIG.cycles.trackAngle;
            cycleItem.trackTarget = DEFAULT_BULLET_CONFIG.cycles.trackTarget;
            // 赋值
            cycleItem.isTrack = isTrack;
        },

        /***************************************************************************************************************
         * 【触发类型】选择
         * @param triggerItem
         */
		triggerModeChange : function (triggerItem) {
			//清空之前内容,并且赋空值
			triggerItem.triggerParams = '';
			// 5
            if (triggerItem.triggerMode === '5') {
                triggerItem.triggerParams = {
                    x : '',
                    y : ''
                };
            }
            // 7
            if (triggerItem.triggerMode === '7') {
                triggerItem.triggerParams = {
                    height : 0,
                    angle : 180
                };
            }
		},

        /***************************************************************************************************************
         * 【触发结果类型】改变事件
         * @param bulletIndex
         * @param cycleIndex
         * @param triggerIndex
         * @param effectIndex
         * @param effectItem
         */
		effectModeChange : function (bulletIndex, cycleIndex, triggerIndex, effectIndex, effectItem) {
			// 检查此【触发结果类型】是否创建过【运动轨迹】
            if (this.checkCircleBeforeEffectChange(bulletIndex, cycleIndex, triggerIndex, effectIndex) === false) {
                return;
            }
            // 检查新炮弹
            let num = this.checkBulletBeforeEffectChange(bulletIndex, cycleIndex, triggerIndex, effectIndex);
            if (num !== 0) {
                alert('当前【触发结果】有【'+num+'】个被创建【弹头】，请先逐一删除');
                return;
            }
			// 最后才能改变触发结果
            this.effectSwitchFn(bulletIndex, cycleIndex, triggerIndex, effectIndex, effectItem, this.BulletConfig.bullets[bulletIndex].cycles[cycleIndex].triggers[triggerIndex].effects[effectIndex]._tempEffectMode);
		},

        // 【触发结果】类型选择改变之前，判断是否创建过【新轨迹】
        checkCircleBeforeEffectChange : function (bulletIndex, cycleIndex, triggerIndex, effectIndex) {
            let cycleSwitchIndex = bulletIndex.toString() + cycleIndex.toString() + triggerIndex.toString() + effectIndex.toString();
            // 检查此【触发结果】是否创建过【运动轨迹】
            for (let i = 0, len = this.BulletConfig.bullets[bulletIndex].cycles.length; i < len; i++) {
                // 如果此轨迹没有launched属性，并且_cycleSwitchIndex === cycleSwitchIndex
                if(!this.BulletConfig.bullets[bulletIndex].cycles[i].launched &&
                    this.BulletConfig.bullets[bulletIndex].cycles[i]._cycleSwitchIndex === cycleSwitchIndex)
                {
                    let confirm = window.confirm('此【触发结果】动态创建过【运动轨迹】，确认删除吗？');
                    if (!confirm) {
                        return false;
                    }
                    this.BulletConfig.bullets[bulletIndex].cycles.splice(i, 1);
                }
            }
            return true;
        },

        // 【触发结果】类型选择改变之前，判断是否创建过【弹头】
        checkBulletBeforeEffectChange : function (bulletIndex, cycleIndex, triggerIndex, effectIndex) {
            let num = 0;
            for (let i = 0; i < this.BulletConfig.bullets.length; i++) {
                if (this.BulletConfig.bullets[i]._bulletIndex === bulletIndex &&
                    this.BulletConfig.bullets[i]._cycleIndex === cycleIndex &&
                    this.BulletConfig.bullets[i]._triggerIndex === triggerIndex &&
                    this.BulletConfig.bullets[i]._effectIndex === effectIndex
                )
                {
                    num++;// 得出总的生成的弹头数
                }
            }
            return num;
        },

        // 【触发结果类型】改变函数
        effectSwitchFn : function (bulletIndex, cycleIndex, triggerIndex, effectIndex, effectItem, tempEffectMode) {
            // 清空之前的选项
            effectItem.effectParams = '';
            // 判断每个可能
            switch (tempEffectMode) {
                // 新建轨迹
                case '1' :
                    effectItem.effectMode = 1;
                    effectItem.effectParams = this.BulletConfig.bullets[bulletIndex]._cycleID;// 指向生成的轨迹ID
                    // 添加新轨迹
                    this.addCycle(bulletIndex, cycleIndex, triggerIndex, effectIndex);
                    break;
                // 效果值
                case '2' :
                    effectItem.effectMode = 2;
                    effectItem.effectParams = {
                        target : '',
                        range : '',
                        effectType : '',
                        effectValue : '',
                        damageType : ''
                    };
                    break;
                // 效果值
                case '3' :
                    effectItem.effectMode = 3;
                    effectItem._method = 1;
                    // 默认为1
                    effectItem.effectParams = {
                        target : '',
                        range : 0,
                        _effectId : '',
                        effectId : '',
                    };
                    break;
                // 地形
                case '4' :
                    effectItem.effectMode = 4;
                    effectItem.effectParams = {
                        destroyRange : 0,
                        destroyShape : '',// 存储破坏边缘图片
                        destroyPoints : '',// 破坏边缘坐标数组
                        destroyEdge : ''
                    };
                    break;
                // 美术
                case '5' :
                    effectItem.effectMode = 5;
                    effectItem.effectParams = '';
                    break;
                // 新建弹头
                case '6' :
                    effectItem.effectMode = 6;
                    effectItem.effectParams = [];
                    break;
                // END
                case '7' :
                    effectItem.effectMode = 7;
                    effectItem.effectParams = 0;// 时长，默认值：0
                    break;
                // 播放动画
                case '8' :
                    effectItem.effectMode = 8;
                    effectItem.effectParams = {
                        animation : '',
                        keepPlay : true,
                    };
                    break;
                default :
                    break;
            }
        },
        
        // 填写效果类型方式选择
        effectItemMethod : function (effectItem, type) {
            effectItem['_method'] = type;
            // 清空
            effectItem.effectParams = '';
            // 赋值
            switch (type) {
                case 1 :
                    effectItem.effectParams = {
                        target : '',
                        range : 0,
                        effectId : '',
                    };
                    break;
                    
                case 2 :
                    effectItem.effectParams = {
                        target : '',
                        range : 0,
                        effect : {
                            round : '',// 生效回合数,
                            effect_animation : '', // 动作
                            tiny_icon : '', // 技能小图标，png
                            effect_effect_1 : '',// 特效
                            effect_effect_2 : '',// 特效
                            effect_effect_3 : '',// 特效
                            effect_type : 0,
                            parameter_1 : '',
                            parameter_2 : '',
                            parameter_3 : '',
                            parameter_4 : '',
                            parameter_5 : '',
                            parameter_6 : '',
                            parameter_7 : '',
                            parameter_8 : '',
                            parameter_9 : '',
                            parameter_10 : ''
                        }
                    };
                    break;
                default :
                    alert('不知道的类型');
                    break;
            }
        },
        
        // 触发结果类型选择
        effectIdChange : function (effectItem, e) {
		    // 变量
            let oEvent = e || window.event;
            let value = oEvent.target.value;
		    // 清空
            effectItem.effectParams.effect = {};
            // 赋值
            effectItem.effectParams.effect = {
                round : '',
                effect_animation : '',
                tiny_icon : '', // 无后缀名
                effect_effect_1 : '',
                effect_effect_2 : '',
                effect_effect_3 : '',
                effect_type : value,// 这里要赋值
                parameter_1 : '',
                parameter_2 : '',
                parameter_3 : '',
                parameter_4 : '',
                parameter_5 : '',
                parameter_6 : '',
                parameter_7 : '',
                parameter_8 : '',
                parameter_9 : '',
                parameter_10 : ''
            }
		},
		
		// 触发效果参数
        effectParamChange : function (describeItem, describeIndex, e) {
			let oEvent = e || window.event;
            let key = 'parameter_' + (describeIndex + 1);
            describeItem[key] = oEvent.target.value;// 这一步写的漂亮，完美的拼接
		},


        /***************************************************************************************************************
         * 下载之前的过滤
         */
        // 删除 bulletShape.type 没有选择的情况
        deleteBulletShape : function (obj) {
            if (obj.hasOwnProperty('bullets')) {
                let arr = obj['bullets'];
                for (let i = 0; i < arr.length; i++) {
                    let type = arr[i].bulletShape.type;
                    if (type === 0 || type === '') {// 如果没有选择值
                        delete arr[i].bulletShape;
                    }
                }
            }
            return obj;
        },

        // 删除keepPlay（如果之前的文件没有keepPlay，那么就要添加，但是如果炮弹类型是图片，那么要删除keepPlay）
        deleteKeepPlay : function (obj) {
            if (obj.hasOwnProperty('bullets')) {
                let arr = obj['bullets'];
                for (let i = 0; i < arr.length; i++) {
                    if (arr[i].image !== '') {
                        delete arr[i].keepPlay;
                    }
                }
            }
            return obj;
        },

        // 当触发结果是生成一个新轨迹的时候：重新修正-触发结果effectParams 指向 轨迹
        changeCircleId : function (obj) {
            // 先将弹头ID整理出来
            let arrBullets = obj.bullets;
            //
            for (let i = 0; i < arrBullets.length; i++) {
                let arr = arrBullets[i].cycles;
                // 先知道id != index的地方，然后再把id改了，然后再id和index保存，以方便下一步的查找
                let tempArr = [];
                for (let i = 0; i < arr.length; i++) {
                    // 先保存这个ID值，从而好找effectParams里面的值
                    if (arr[i].id !== parseInt(i+1)) {
                        // 保存id和index
                        tempArr.push({
                            old : arr[i].id,
                            now : parseInt(i+1)
                        });
                        // 1：将ID名称先改变
                        arr[i].id = parseInt(i+1);
                    }
                }

                // 循环所有effectParams = [3,4,5,6],判断是否等于旧Id，如果等于，就改变，并且赋上新的index
                for (let i = 0, len = arrBullets.length; i < len; i++) {
                    // 2：改变effects.effectParams
                    for (let j = 0, lenj = arrBullets[i].cycles.length; j < lenj; j++) {
                        for (let r = 0, lenr = arrBullets[i].cycles[j].triggers.length; r < lenr; r++) {
                            for (let x = 0, lenx = arrBullets[i].cycles[j].triggers[r].effects.length; x < lenx; x++) {
                                // 如果出发条件是添加弹头，那么就要判断弹头id的指向
                                if (arrBullets[i].cycles[j].triggers[r].effects[x].effectMode === 1) {
                                    // 生成弹头的effectParams 是数组
                                    let effectParams = arrBullets[i].cycles[j].triggers[r].effects[x].effectParams;

                                    for (let q = 0, lenq = tempArr.length; q < lenq; q++) {
                                        // 如果effectParams = 以前的数值，那么就换成现在的数值
                                        if (arrBullets[i].cycles[j].triggers[r].effects[x].effectParams === tempArr[q].old) {
                                            arrBullets[i].cycles[j].triggers[r].effects[x].effectParams = tempArr[q].now;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
            return obj;
        },

		// 当触发结果是生成一个新炮弹的时候：重新修正-触发结果effectParams 指向 炮弹的id
		changeID : function (obj) {
			// 先将弹头ID整理出来
			let arr = obj.bullets;
			// 先知道id != index的地方，然后再把id改了，然后再id和index保存，以方便下一步的查找
            let tempArr = [];
			for (let i = 0, len = arr.length; i < len; i++) {
				// 先保存这个ID值，从而好找effectParams里面的值
				if (arr[i].id !== parseInt(i+1)) {
					// 保存id和index
					tempArr.push({
						old : arr[i].id,
						now : parseInt(i+1)
					});
					// 1：将ID名称先改变
					arr[i].id = parseInt(i+1);
				}
			}
			
			// 循环所有effectParams = [3,4,5,6],判断是否等于旧Id，如果等于，就改变，并且赋上新的index
			for (let i = 0, len = arr.length; i < len; i++) {
				// 2：改变effects.effectParams
				for (let j = 0, lenj = arr[i].cycles.length; j < lenj; j++) {
					for (let r = 0, lenr = arr[i].cycles[j].triggers.length; r < lenr; r++) {
						for (let x = 0, lenx = arr[i].cycles[j].triggers[r].effects.length; x < lenx; x++) {
						    // 如果出发条件是添加弹头，那么就要判断弹头id的指向
							if (arr[i].cycles[j].triggers[r].effects[x].effectMode === 6) {
                                // 生成弹头的effectParams 是数组
                                let arrParams = arr[i].cycles[j].triggers[r].effects[x].effectParams;
								for (let e = 0, lene = arrParams.length; e < lene; e++) {
									for (let q = 0, lenq = tempArr.length; q < lenq; q++) {

										if (arrParams[e] === tempArr[q].old) {
											arrParams[e] = tempArr[q].now;
										}
									}
								}
							}
						}
					}
				}
			}
			return obj;
		},
        
        // 获取效果id
        getEffectId : function (obj) {
		    let aBullets = obj.bullets;
		    for (let i = 0; i < aBullets.length; i++) {
                for (let j = 0, lenj = aBullets[i].cycles.length; j < lenj; j++) {
                    for (let r = 0, lenr = aBullets[i].cycles[j].triggers.length; r < lenr; r++) {
                        for (let x = 0, lenx = aBullets[i].cycles[j].triggers[r].effects.length; x < lenx; x++) {
                        
                            if (aBullets[i].cycles[j].triggers[r].effects[x].effectMode === 3) {
                                let method = aBullets[i].cycles[j].triggers[r].effects[x]._method;
                                
                                if (method === 1) {
                                    aBullets[i].cycles[j].triggers[r].effects[x].effectParams.effectId = obj.id + aBullets[i].cycles[j].triggers[r].effects[x].effectParams._effectId;
                                }
                            }
                        }
                    }
                }
            }
            return obj;
        },


        /***************************************************************************************************************
         * 下载
         */
        // 点击下载
        download : function () {
            // 获取下载次数
            let tempId = this.BulletConfig._id;
            let num = this.maxScope - this.minScope + 1;
            let scope = this.minScope;
            let i = 1;
            // 下载次数
            doRecursion.call(this);

            function doRecursion() {
                let copyBulletConfig = cyber.deepcopy(this.BulletConfig);// 必须要深拷贝，不然会改变this.BulletConfig的bullets的ID
                let level = cyber.double(scope);
                copyBulletConfig.id = tempId + level;// 计算id
                this.downloadText(copyBulletConfig, level);// 下载.txt
                this.downloadLUA(copyBulletConfig, level);// 下载.lua
                scope++;//
                // 递归
                if (i < num) {
                    setTimeout(function () {
                        i++;
                        doRecursion.call(this);
                    }.bind(this), 1000);
                }
            }
        },
    
        // 下载.txt
        downloadText : function (obj, level) {
            let content = JSON.stringify(obj, undefined, 4);// 将json对象转换为json字符串
            let filename = 'bullet_' + obj._id + level + '.txt';// 设置文件名
            // 下载
            window.download(content, filename);
        },
    
        // 下载.lua
        downloadLUA : function (obj, level) {
            obj = cyber.deepcopy(obj);// 深拷贝，避免影响原来的对象结构
            obj = this.changeCircleId(obj);// 改变动态生成轨迹的顺序
            obj = this.changeID(obj);// 改变炮弹的id为正常的顺序
            obj = this.getEffectId(obj);// 获取effectId
            // 定义名字
            let filename = 'bullet_' + obj._id + level+ '.lua';
            // 过滤
            obj = this.deleteBulletShape(obj);// 删除没有type类型的bulletShape
            obj = this.deleteKeepPlay(obj);// 删除当炮弹类型是image时的keepPlay
            obj = cyber.deletePrivateProperty(obj);// 删除私有属性
            obj = cyber.deleteEmptyString(obj);// 删除值为空的字段
            obj = cyber.changeStringToNumber(obj);// 将'数字字符串'转为'数值类型'
            // lua格式化
            let content = cyber.format.lua({
                obj : obj,
                name : 'BulletConfig',
                delimiter : '\n',// WINDOW-'\r\n';LINUX/UNIX-'\n';MAC-'\r';
            });
            // 开始下载
            window.download(content, filename);
        },


        /***************************************************************************************************************
         * ajax
         */
        // ajax获取buff配置
		getBuffConfig : function () {
            let url = "../config/buffId.config.json";
            this.$http.post(url, {
            
            }, {
                emulateJSON : false
            }).then(function (data) {
                this.buffConfig = data.body;
                // console.log(this.buffConfig);
            }, function (response) {
                console.info('没有连接,状态码：' + response.status);
            });
		},
  
  
	},// methods end
    
	
    /*******************************************************************************************************************
	 * created属性
     */
	created : function () {
	    // 获取config.buff.json 的配置
 		this.getBuffConfig();
	},

});


/**
 * 阻止默认
 */
document.body.ondragover = function (event) {
    let oEvent = event || window.event;
    oEvent.preventDefault();
};

document.body.ondrop = function (event) {
    let oEvent = event || window.event;
    // 这句话为什么是个bug ，我也不清楚
    if (oEvent.target.localName === 'input' && oEvent.target.type === 'text') {
        oEvent.preventDefault();
    }
    if (oEvent.target.localName !== 'input' && oEvent.target.type !== 'file') {
        oEvent.preventDefault();
    }
};