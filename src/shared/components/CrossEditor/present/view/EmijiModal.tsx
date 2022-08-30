import React, { useState, useMemo, useCallback } from 'react';
import { Button, Popup, Icon } from 'semantic-ui-react';

interface Props {
  selectEmoji: (emoji: string) => void;
  onClose: () => void;
}

export function EmojiModal({ selectEmoji, onClose }: Props) {
  const randomId = useMemo(() => {
    return Math.random().toString();
  }, []);

  const [scrollId, setScrollId] = useState<string>(`${randomId}-emoji-smily`);

  const onEmojiClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      const emoji = e.currentTarget.innerText;
      selectEmoji(emoji);
    },
    [selectEmoji]
  );

  const onEmojiScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      const smilyTop = document.getElementById(`${randomId}-emoji-smily`)?.offsetTop || 0;
      const handTop = document.getElementById(`${randomId}-emoji-hand`)?.offsetTop || 0;
      const personTop = document.getElementById(`${randomId}-emoji-person`)?.offsetTop || 0;
      const codeTop = document.getElementById(`${randomId}-emoji-code`)?.offsetTop || 0;
      const foodTop = document.getElementById(`${randomId}-emoji-food`)?.offsetTop || 0;
      const locationTop = document.getElementById(`${randomId}-emoji-location`)?.offsetTop || 0;
      const thingTop = document.getElementById(`${randomId}-emoji-thing`)?.offsetTop || 0;
      const div = e.currentTarget;
      const test = div.scrollTop;

      const scrollBottom = div.scrollHeight - div.offsetHeight;
      if (test >= scrollBottom) {
        setScrollId(`${randomId}-emoji-animal`);
      } else if (test >= thingTop - smilyTop) {
        setScrollId(`${randomId}-emoji-thing`);
      } else if (test >= locationTop - smilyTop) {
        setScrollId(`${randomId}-emoji-location`);
      } else if (test >= foodTop - smilyTop) {
        setScrollId(`${randomId}-emoji-food`);
      } else if (test >= codeTop - smilyTop) {
        setScrollId(`${randomId}-emoji-code`);
      } else if (test >= personTop - smilyTop) {
        setScrollId(`${randomId}-emoji-person`);
      } else if (test >= handTop - smilyTop) {
        setScrollId(`${randomId}-emoji-hand`);
      } else {
        setScrollId(`${randomId}-emoji-smily`);
      }
    },
    [randomId]
  );

  return (
    <div className="emoji_popup_wrap">
      <div className="emoji_header">
        <a
          className={`emoji_list ${scrollId === `${randomId}-emoji-smily` && 'active'}`}
          onClick={() => {
            if (document.getElementById(`${randomId}-emoji_popup_body`) !== null) {
              document.getElementById(`${randomId}-emoji_popup_body`)!.scrollTop = 0;
            }
          }}
        >
          <Icon className="icon_emoji_1" />
        </a>
        <a
          className={`emoji_list ${scrollId === `${randomId}-emoji-hand` && 'active'}`}
          onClick={() => {
            if (document.getElementById(`${randomId}-emoji_popup_body`) !== null) {
              document.getElementById(`${randomId}-emoji_popup_body`)!.scrollTop =
                (document.getElementById(`${randomId}-emoji-hand`)?.offsetTop || 0) -
                (document.getElementById(`${randomId}-emoji-smily`)?.offsetTop || 0);
            }
          }}
        >
          <Icon className="icon_emoji_2" />
        </a>
        <a
          className={`emoji_list ${scrollId === `${randomId}-emoji-person` && 'active'}`}
          onClick={() => {
            if (document.getElementById(`${randomId}-emoji_popup_body`) !== null) {
              document.getElementById(`${randomId}-emoji_popup_body`)!.scrollTop =
                (document.getElementById(`${randomId}-emoji-person`)?.offsetTop || 0) -
                (document.getElementById(`${randomId}-emoji-smily`)?.offsetTop || 0);
            }
          }}
        >
          <Icon className="icon_emoji_3" />
        </a>
        <a
          className={`emoji_list ${scrollId === `${randomId}-emoji-code` && 'active'}`}
          onClick={() => {
            if (document.getElementById(`${randomId}-emoji_popup_body`) !== null) {
              document.getElementById(`${randomId}-emoji_popup_body`)!.scrollTop =
                (document.getElementById(`${randomId}-emoji-code`)?.offsetTop || 0) -
                (document.getElementById(`${randomId}-emoji-smily`)?.offsetTop || 0);
            }
          }}
        >
          <Icon className="icon_emoji_4" />
        </a>
        <a
          className={`emoji_list ${scrollId === `${randomId}-emoji-food` && 'active'}`}
          onClick={() => {
            if (document.getElementById(`${randomId}-emoji_popup_body`) !== null) {
              document.getElementById(`${randomId}-emoji_popup_body`)!.scrollTop =
                (document.getElementById(`${randomId}-emoji-food`)?.offsetTop || 0) -
                (document.getElementById(`${randomId}-emoji-smily`)?.offsetTop || 0);
            }
          }}
        >
          <Icon className="icon_emoji_5" />
        </a>
        <a
          className={`emoji_list ${scrollId === `${randomId}-emoji-location` && 'active'}`}
          onClick={() => {
            if (document.getElementById(`${randomId}-emoji_popup_body`) !== null) {
              document.getElementById(`${randomId}-emoji_popup_body`)!.scrollTop =
                (document.getElementById(`${randomId}-emoji-location`)?.offsetTop || 0) -
                (document.getElementById(`${randomId}-emoji-smily`)?.offsetTop || 0);
            }
          }}
        >
          <Icon className="icon_emoji_6" />
        </a>
        <a
          className={`emoji_list ${scrollId === `${randomId}-emoji-thing` && 'active'}`}
          onClick={() => {
            if (document.getElementById(`${randomId}-emoji_popup_body`) !== null) {
              document.getElementById(`${randomId}-emoji_popup_body`)!.scrollTop =
                (document.getElementById(`${randomId}-emoji-thing`)?.offsetTop || 0) -
                (document.getElementById(`${randomId}-emoji-smily`)?.offsetTop || 0);
            }
          }}
        >
          <Icon className="icon_emoji_7" />
        </a>
        <a
          className={`emoji_list ${scrollId === `${randomId}-emoji-animal` && 'active'}`}
          onClick={() => {
            if (document.getElementById(`${randomId}-emoji_popup_body`) !== null) {
              document.getElementById(`${randomId}-emoji_popup_body`)!.scrollTop =
                (document.getElementById(`${randomId}-emoji-animal`)?.offsetTop || 0) -
                (document.getElementById(`${randomId}-emoji-smily`)?.offsetTop || 0);
            }
          }}
        >
          <Icon className="icon_emoji_8" />
        </a>
      </div>
      <div className="emoji_popup_body" id={`${randomId}-emoji_popup_body`} onScroll={onEmojiScroll}>
        <div className="emoji_inner">
          <div className="emoji_box emoji_01" id="emoji01">
            <strong className="emoji_tit" id={`${randomId}-emoji-smily`}>
              스마일리
            </strong>
            <div className="emoji_icons">
              {/* icon당  22px * 22px */}
              <Button className="em_b" onClick={onEmojiClick}>
                😀
              </Button>
              <Button className="em_b" onClick={onEmojiClick}>
                😄
              </Button>
              <Button className="em_b" onClick={onEmojiClick}>
                😁
              </Button>
              <Button className="em_b" onClick={onEmojiClick}>
                😆
              </Button>
              <Button className="em_b" onClick={onEmojiClick}>
                😄
              </Button>
              <Button className="em_b" onClick={onEmojiClick}>
                😂
              </Button>
              <Button className="em_b" onClick={onEmojiClick}>
                😉
              </Button>
              <Button className="em_b" onClick={onEmojiClick}>
                😇
              </Button>
              <Button className="em_b" onClick={onEmojiClick}>
                🥰
              </Button>
              <Button className="em_b" onClick={onEmojiClick}>
                😍
              </Button>
              <Button className="em_b" onClick={onEmojiClick}>
                😊
              </Button>
              <Button className="em_b" onClick={onEmojiClick}>
                🤔
              </Button>
              <Button className="em_b" onClick={onEmojiClick}>
                😴
              </Button>
              <Button className="em_b" onClick={onEmojiClick}>
                🤤
              </Button>
              <Button className="em_b" onClick={onEmojiClick}>
                😷
              </Button>
              <Button className="em_b" onClick={onEmojiClick}>
                🤒
              </Button>
              <Button className="em_b" onClick={onEmojiClick}>
                🥵
              </Button>
              <Button className="em_b" onClick={onEmojiClick}>
                🥶
              </Button>
              <Button className="em_b" onClick={onEmojiClick}>
                🥳
              </Button>
              <Button className="em_b" onClick={onEmojiClick}>
                ☹️
              </Button>
              <Button className="em_b" onClick={onEmojiClick}>
                😳
              </Button>
              <Button className="em_b" onClick={onEmojiClick}>
                😥
              </Button>
              <Button className="em_b" onClick={onEmojiClick}>
                😭
              </Button>
              <Button className="em_b" onClick={onEmojiClick}>
                😱
              </Button>
              <Button className="em_b" onClick={onEmojiClick}>
                😤
              </Button>
              <Button className="em_b" onClick={onEmojiClick}>
                😠
              </Button>
              <Button className="em_b" onClick={onEmojiClick}>
                😎
              </Button>
              <Button className="em_b" onClick={onEmojiClick}>
                🤯
              </Button>
              <Button className="em_b" onClick={onEmojiClick}>
                💘
              </Button>
              <Button className="em_b" onClick={onEmojiClick}>
                💖
              </Button>
              <Button className="em_b" onClick={onEmojiClick}>
                ❤️
              </Button>
              <Button className="em_b" onClick={onEmojiClick}>
                💕
              </Button>
            </div>
          </div>
          <div className="emoji_box emoji_02" id="emoji02">
            <strong className="emoji_tit" id={`${randomId}-emoji-hand`}>
              손동작
            </strong>
            <div className="emoji_icons">
              <Button className="em_b" onClick={onEmojiClick}>
                👋
              </Button>
              <Button className="em_b" onClick={onEmojiClick}>
                🤚
              </Button>
              <Button className="em_b" onClick={onEmojiClick}>
                👌
              </Button>
              <Button className="em_b" onClick={onEmojiClick}>
                ✌️
              </Button>
              <Button className="em_b" onClick={onEmojiClick}>
                🤟
              </Button>
              <Button className="em_b" onClick={onEmojiClick}>
                👉
              </Button>
              <Button className="em_b" onClick={onEmojiClick}>
                👈
              </Button>
              <Button className="em_b" onClick={onEmojiClick}>
                👆
              </Button>
              <Button className="em_b" onClick={onEmojiClick}>
                👇
              </Button>
              <Button className="em_b" onClick={onEmojiClick}>
                ☝️
              </Button>
              <Button className="em_b" onClick={onEmojiClick}>
                👍
              </Button>
              <Button className="em_b" onClick={onEmojiClick}>
                👎
              </Button>
              <Button className="em_b" onClick={onEmojiClick}>
                ✊
              </Button>
              <Button className="em_b" onClick={onEmojiClick}>
                👊
              </Button>
              <Button className="em_b" onClick={onEmojiClick}>
                👏
              </Button>
              <Button className="em_b" onClick={onEmojiClick}>
                🙌
              </Button>
              <Button className="em_b" onClick={onEmojiClick}>
                🙏
              </Button>
              <Button className="em_b" onClick={onEmojiClick}>
                ✍️
              </Button>
              <Button className="em_b" onClick={onEmojiClick}>
                💪
              </Button>
            </div>
          </div>
          <div className="emoji_box emoji_03" id="emoji03">
            <strong className="emoji_tit" id={`${randomId}-emoji-person`}>
              사람
            </strong>
            <div className="emoji_icons">
              <Button className="em_b" onClick={onEmojiClick}>
                👶🏻
              </Button>
              <Button className="em_b" onClick={onEmojiClick}>
                👦🏻
              </Button>
              <Button className="em_b" onClick={onEmojiClick}>
                👧🏻
              </Button>
              <Button className="em_b" onClick={onEmojiClick}>
                🧑🏻
              </Button>
              <Button className="em_b" onClick={onEmojiClick}>
                👨🏻
              </Button>
              <Button className="em_b" onClick={onEmojiClick}>
                🙆🏻‍♂️
              </Button>
              <Button className="em_b" onClick={onEmojiClick}>
                🙆🏻‍♀️
              </Button>
              <Button className="em_b" onClick={onEmojiClick}>
                🙅🏻‍♂️
              </Button>
              <Button className="em_b" onClick={onEmojiClick}>
                🙅🏻‍♀️
              </Button>
              <Button className="em_b" onClick={onEmojiClick}>
                🙋🏻‍♂️
              </Button>
              <Button className="em_b" onClick={onEmojiClick}>
                🙋🏻‍♀️
              </Button>
              <Button className="em_b" onClick={onEmojiClick}>
                🤦🏻‍♂️
              </Button>
              <Button className="em_b" onClick={onEmojiClick}>
                🤦🏻‍♀️
              </Button>
              <Button className="em_b" onClick={onEmojiClick}>
                🤷🏻‍♂️
              </Button>
              <Button className="em_b" onClick={onEmojiClick}>
                🤷🏻‍♀️
              </Button>
              <Button className="em_b" onClick={onEmojiClick}>
                👨🏻‍💼
              </Button>
              <Button className="em_b" onClick={onEmojiClick}>
                👨🏻‍💻
              </Button>
              <Button className="em_b" onClick={onEmojiClick}>
                🙇🏻‍♂️
              </Button>
              <Button className="em_b" onClick={onEmojiClick}>
                🙇🏻‍♀️
              </Button>
              <Button className="em_b" onClick={onEmojiClick}>
                🙎🏻‍♂️
              </Button>
              <Button className="em_b" onClick={onEmojiClick}>
                🙎🏻‍♀️
              </Button>
              <Button className="em_b" onClick={onEmojiClick}>
                🧘🏻‍♂️
              </Button>
              <Button className="em_b" onClick={onEmojiClick}>
                🧘🏻‍♀️
              </Button>
              <Button className="em_b" onClick={onEmojiClick}>
                🏃🏻‍♂️
              </Button>
              <Button className="em_b" onClick={onEmojiClick}>
                🏃🏻‍♀️
              </Button>
              <Button className="em_b" onClick={onEmojiClick}>
                🤸🏻‍♂️
              </Button>
              <Button className="em_b" onClick={onEmojiClick}>
                🤸🏻‍♀️
              </Button>
              <Button className="em_b" onClick={onEmojiClick}>
                👼🏻
              </Button>
              <Button className="em_b" onClick={onEmojiClick}>
                🎅🏻
              </Button>
            </div>
          </div>
          <div className="emoji_box emoji_04" id="emoji04">
            <strong className="emoji_tit" id={`${randomId}-emoji-code`}>
              기호
            </strong>
            <div className="emoji_icons">
              <Button className="em_b" onClick={onEmojiClick}>
                💯
              </Button>
              <Button className="em_b" onClick={onEmojiClick}>
                💢
              </Button>
              <Button className="em_b" onClick={onEmojiClick}>
                💥
              </Button>
              <Button className="em_b" onClick={onEmojiClick}>
                💤
              </Button>
              <Button className="em_b" onClick={onEmojiClick}>
                🎶
              </Button>
              <Button className="em_b" onClick={onEmojiClick}>
                💦
              </Button>
              <Button className="em_b" onClick={onEmojiClick}>
                💬
              </Button>
              <Button className="em_b" onClick={onEmojiClick}>
                💭
              </Button>
              <Button className="em_b" onClick={onEmojiClick}>
                ⭕
              </Button>
              <Button className="em_b" onClick={onEmojiClick}>
                ❌
              </Button>
              <Button className="em_b" onClick={onEmojiClick}>
                🚫
              </Button>
              <Button className="em_b" onClick={onEmojiClick}>
                ⛔
              </Button>
              <Button className="em_b" onClick={onEmojiClick}>
                ✅
              </Button>
              <Button className="em_b" onClick={onEmojiClick}>
                ⬆️
              </Button>
              <Button className="em_b" onClick={onEmojiClick}>
                ⬇️
              </Button>
              <Button className="em_b" onClick={onEmojiClick}>
                🔄
              </Button>
              <Button className="em_b" onClick={onEmojiClick}>
                ⬅️
              </Button>
              <Button className="em_b" onClick={onEmojiClick}>
                ➡️
              </Button>
              <Button className="em_b" onClick={onEmojiClick}>
                ❗
              </Button>
              <Button className="em_b" onClick={onEmojiClick}>
                ❓
              </Button>
              <Button className="em_b" onClick={onEmojiClick}>
                💲
              </Button>
              <Button className="em_b" onClick={onEmojiClick}>
                ⚠️
              </Button>
              <Button className="em_b" onClick={onEmojiClick}>
                💣
              </Button>
              <Button className="em_b" onClick={onEmojiClick}>
                ♨️
              </Button>
              <Button className="em_b" onClick={onEmojiClick}>
                🆙
              </Button>
              <Button className="em_b" onClick={onEmojiClick}>
                🆕
              </Button>
              <Button className="em_b" onClick={onEmojiClick}>
                🆘
              </Button>
              <Button className="em_b" onClick={onEmojiClick}>
                🔣
              </Button>
            </div>
          </div>
          <div className="emoji_box emoji_05" id="emoji05">
            <strong className="emoji_tit" id={`${randomId}-emoji-food`}>
              음식
            </strong>
            <div className="emoji_icons">
              <Button className="em_b" onClick={onEmojiClick}>
                🍇
              </Button>
              <Button className="em_b" onClick={onEmojiClick}>
                🍉
              </Button>
              <Button className="em_b" onClick={onEmojiClick}>
                🍊
              </Button>
              <Button className="em_b" onClick={onEmojiClick}>
                🍌
              </Button>
              <Button className="em_b" onClick={onEmojiClick}>
                🍍
              </Button>
              <Button className="em_b" onClick={onEmojiClick}>
                🍎
              </Button>
              <Button className="em_b" onClick={onEmojiClick}>
                🍑
              </Button>
              <Button className="em_b" onClick={onEmojiClick}>
                🍓
              </Button>
              <Button className="em_b" onClick={onEmojiClick}>
                🥕
              </Button>
              <Button className="em_b" onClick={onEmojiClick}>
                🌽
              </Button>
              <Button className="em_b" onClick={onEmojiClick}>
                🌶️
              </Button>
              <Button className="em_b" onClick={onEmojiClick}>
                🍞
              </Button>
              <Button className="em_b" onClick={onEmojiClick}>
                🍕
              </Button>
              <Button className="em_b" onClick={onEmojiClick}>
                🥩
              </Button>
              <Button className="em_b" onClick={onEmojiClick}>
                🍗
              </Button>
              <Button className="em_b" onClick={onEmojiClick}>
                🍔
              </Button>
              <Button className="em_b" onClick={onEmojiClick}>
                🍟
              </Button>
              <Button className="em_b" onClick={onEmojiClick}>
                🍱
              </Button>
              <Button className="em_b" onClick={onEmojiClick}>
                🍛
              </Button>
              <Button className="em_b" onClick={onEmojiClick}>
                🍜
              </Button>
              <Button className="em_b" onClick={onEmojiClick}>
                🍝
              </Button>
              <Button className="em_b" onClick={onEmojiClick}>
                🍣
              </Button>
              <Button className="em_b" onClick={onEmojiClick}>
                🦀
              </Button>
              <Button className="em_b" onClick={onEmojiClick}>
                🍩
              </Button>
              <Button className="em_b" onClick={onEmojiClick}>
                🍦
              </Button>
              <Button className="em_b" onClick={onEmojiClick}>
                🎂
              </Button>
              <Button className="em_b" onClick={onEmojiClick}>
                🍫
              </Button>
              <Button className="em_b" onClick={onEmojiClick}>
                🍬
              </Button>
              <Button className="em_b" onClick={onEmojiClick}>
                ☕
              </Button>
              <Button className="em_b" onClick={onEmojiClick}>
                🍷
              </Button>
              <Button className="em_b" onClick={onEmojiClick}>
                🍺
              </Button>
              <Button className="em_b" onClick={onEmojiClick}>
                🍽️
              </Button>
            </div>
          </div>
          <div className="emoji_box emoji_06" id="emoji06">
            <strong className="emoji_tit" id={`${randomId}-emoji-location`}>
              여행 및 장소
            </strong>
            <div className="emoji_icons">
              <Button className="em_b" onClick={onEmojiClick}>
                🏕️
              </Button>
              <Button className="em_b" onClick={onEmojiClick}>
                🏖️
              </Button>
              <Button className="em_b" onClick={onEmojiClick}>
                🏝️
              </Button>
              <Button className="em_b" onClick={onEmojiClick}>
                🏞️
              </Button>
              <Button className="em_b" onClick={onEmojiClick}>
                🏠
              </Button>
              <Button className="em_b" onClick={onEmojiClick}>
                🏥
              </Button>
              <Button className="em_b" onClick={onEmojiClick}>
                🌃
              </Button>
              <Button className="em_b" onClick={onEmojiClick}>
                🏙️
              </Button>
              <Button className="em_b" onClick={onEmojiClick}>
                🌅
              </Button>
              <Button className="em_b" onClick={onEmojiClick}>
                🌄
              </Button>
              <Button className="em_b" onClick={onEmojiClick}>
                🎡
              </Button>
              <Button className="em_b" onClick={onEmojiClick}>
                🎠
              </Button>
              <Button className="em_b" onClick={onEmojiClick}>
                🌍
              </Button>
              <Button className="em_b" onClick={onEmojiClick}>
                🌋
              </Button>
              <Button className="em_b" onClick={onEmojiClick}>
                🏢
              </Button>
              <Button className="em_b" onClick={onEmojiClick}>
                🚓
              </Button>
              <Button className="em_b" onClick={onEmojiClick}>
                🚗
              </Button>
              <Button className="em_b" onClick={onEmojiClick}>
                🚕
              </Button>
              <Button className="em_b" onClick={onEmojiClick}>
                🏍️
              </Button>
              <Button className="em_b" onClick={onEmojiClick}>
                🚲
              </Button>
              <Button className="em_b" onClick={onEmojiClick}>
                🚞
              </Button>
              <Button className="em_b" onClick={onEmojiClick}>
                🚝
              </Button>
              <Button className="em_b" onClick={onEmojiClick}>
                🚊
              </Button>
              <Button className="em_b" onClick={onEmojiClick}>
                ✈️
              </Button>
              <Button className="em_b" onClick={onEmojiClick}>
                🌕
              </Button>
              <Button className="em_b" onClick={onEmojiClick}>
                🌙
              </Button>
              <Button className="em_b" onClick={onEmojiClick}>
                🌟
              </Button>
              <Button className="em_b" onClick={onEmojiClick}>
                ☀️
              </Button>
              <Button className="em_b" onClick={onEmojiClick}>
                🌥️
              </Button>
              <Button className="em_b" onClick={onEmojiClick}>
                ⛈️
              </Button>
              <Button className="em_b" onClick={onEmojiClick}>
                🌈
              </Button>
              <Button className="em_b" onClick={onEmojiClick}>
                ☃️
              </Button>
            </div>
          </div>
          <div className="emoji_box emoji_07" id="emoji07">
            <strong className="emoji_tit" id={`${randomId}-emoji-thing`}>
              사물
            </strong>
            <div className="emoji_icons">
              <Button className="em_b" onClick={onEmojiClick}>
                🏅
              </Button>
              <Button className="em_b" onClick={onEmojiClick}>
                🏆
              </Button>
              <Button className="em_b" onClick={onEmojiClick}>
                🎁
              </Button>
              <Button className="em_b" onClick={onEmojiClick}>
                🎉
              </Button>
              <Button className="em_b" onClick={onEmojiClick}>
                ⚽
              </Button>
              <Button className="em_b" onClick={onEmojiClick}>
                ⚾
              </Button>
              <Button className="em_b" onClick={onEmojiClick}>
                🏀
              </Button>
              <Button className="em_b" onClick={onEmojiClick}>
                🏐
              </Button>
              <Button className="em_b" onClick={onEmojiClick}>
                🎳
              </Button>
              <Button className="em_b" onClick={onEmojiClick}>
                🤿
              </Button>
              <Button className="em_b" onClick={onEmojiClick}>
                🎣
              </Button>
              <Button className="em_b" onClick={onEmojiClick}>
                🎮
              </Button>
              <Button className="em_b" onClick={onEmojiClick}>
                🧸
              </Button>
              <Button className="em_b" onClick={onEmojiClick}>
                🎨
              </Button>
              <Button className="em_b" onClick={onEmojiClick}>
                👑
              </Button>
              <Button className="em_b" onClick={onEmojiClick}>
                💎
              </Button>
              <Button className="em_b" onClick={onEmojiClick}>
                💡
              </Button>
              <Button className="em_b" onClick={onEmojiClick}>
                📱
              </Button>
              <Button className="em_b" onClick={onEmojiClick}>
                💻
              </Button>
              <Button className="em_b" onClick={onEmojiClick}>
                📽️
              </Button>
              <Button className="em_b" onClick={onEmojiClick}>
                📷
              </Button>
              <Button className="em_b" onClick={onEmojiClick}>
                🔎
              </Button>
              <Button className="em_b" onClick={onEmojiClick}>
                📚
              </Button>
              <Button className="em_b" onClick={onEmojiClick}>
                📒
              </Button>
              <Button className="em_b" onClick={onEmojiClick}>
                📄
              </Button>
              <Button className="em_b" onClick={onEmojiClick}>
                💵
              </Button>
              <Button className="em_b" onClick={onEmojiClick}>
                ✏️
              </Button>
              <Button className="em_b" onClick={onEmojiClick}>
                🖋️
              </Button>
              <Button className="em_b" onClick={onEmojiClick}>
                ✉️
              </Button>
              <Button className="em_b" onClick={onEmojiClick}>
                🗓️
              </Button>
              <Button className="em_b" onClick={onEmojiClick}>
                📊
              </Button>
              <Button className="em_b" onClick={onEmojiClick}>
                🛒
              </Button>
            </div>
          </div>
          <div className="emoji_box emoji_08" id="emoji08">
            <strong className="emoji_tit" id={`${randomId}-emoji-animal`}>
              동물
            </strong>
            <div className="emoji_icons">
              <Button className="em_b" onClick={onEmojiClick}>
                🐵
              </Button>
              <Button className="em_b" onClick={onEmojiClick}>
                🐶
              </Button>
              <Button className="em_b" onClick={onEmojiClick}>
                🦊
              </Button>
              <Button className="em_b" onClick={onEmojiClick}>
                🐱
              </Button>
              <Button className="em_b" onClick={onEmojiClick}>
                🦁
              </Button>
              <Button className="em_b" onClick={onEmojiClick}>
                🐯
              </Button>
              <Button className="em_b" onClick={onEmojiClick}>
                🐴
              </Button>
              <Button className="em_b" onClick={onEmojiClick}>
                🦓
              </Button>
              <Button className="em_b" onClick={onEmojiClick}>
                🐷
              </Button>
              <Button className="em_b" onClick={onEmojiClick}>
                🐫
              </Button>
              <Button className="em_b" onClick={onEmojiClick}>
                🦒
              </Button>
              <Button className="em_b" onClick={onEmojiClick}>
                🐘
              </Button>
              <Button className="em_b" onClick={onEmojiClick}>
                🐭
              </Button>
              <Button className="em_b" onClick={onEmojiClick}>
                🐰
              </Button>
              <Button className="em_b" onClick={onEmojiClick}>
                🐿️
              </Button>
              <Button className="em_b" onClick={onEmojiClick}>
                🦇
              </Button>
              <Button className="em_b" onClick={onEmojiClick}>
                🐻
              </Button>
              <Button className="em_b" onClick={onEmojiClick}>
                🐼
              </Button>
              <Button className="em_b" onClick={onEmojiClick}>
                🐨
              </Button>
              <Button className="em_b" onClick={onEmojiClick}>
                🐓
              </Button>
              <Button className="em_b" onClick={onEmojiClick}>
                🐣
              </Button>
              <Button className="em_b" onClick={onEmojiClick}>
                🐸
              </Button>
              <Button className="em_b" onClick={onEmojiClick}>
                🐢
              </Button>
              <Button className="em_b" onClick={onEmojiClick}>
                🐳
              </Button>
              <Button className="em_b" onClick={onEmojiClick}>
                🐟
              </Button>
              <Button className="em_b" onClick={onEmojiClick}>
                🦈
              </Button>
              <Button className="em_b" onClick={onEmojiClick}>
                🐙
              </Button>
              <Button className="em_b" onClick={onEmojiClick}>
                🦋
              </Button>
              <Button className="em_b" onClick={onEmojiClick}>
                🐜
              </Button>
              <Button className="em_b" onClick={onEmojiClick}>
                🐝
              </Button>
              <Button className="em_b" onClick={onEmojiClick}>
                🐞
              </Button>
              <Button className="em_b" onClick={onEmojiClick}>
                🕷️
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className="emoji_bottom">
        <button className="ui button emoji_close" onClick={onClose}>
          <i aria-hidden="true" className="icon banner-close" />
        </button>
      </div>
    </div>
  );
}
