import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { setQuizTable, useQuizTable } from 'cubetype/quiz/store/QuizStore';
import { Table, Form, Input } from 'semantic-ui-react';
import { MediaService } from 'cube/media';
import QuizTableList from 'cubetype/quiz/model/QuizTableList';
import NumberFormat from 'react-number-format';
import { reactAlert } from '@nara.platform/accent';

interface Props {
  quizHeaderState: { showTime: number | string; endTime: number; name: string } | undefined;
  setQuizHeaderState: (state: any) => void;
}

const limit = (val: string, max: string) => {
  if (val.length === 1 && val[0] > max[0]) {
    val = '0' + val;
  } else if (val.length === 1 && val[0] <= max[0]) {
    val = val[0] + '0';
  }

  if (val.length === 2) {
    if (val > max) {
      val = max;
    }
  }

  return val;
};

const CreateQuizTableHeaderContainer: React.FC<Props> = ({ quizHeaderState, setQuizHeaderState }) => {
  // const log = console.log;
  const mediaService = MediaService?.instance.media;
  const durationValue = useRef(mediaService?.mediaContents?.internalMedias[0]?.duration || 0);
  const [time, setTime] = useState<string>(quizHeaderState?.showTime.toString() || '0');

  const onChangeHeaderState = useCallback(
    (type: string, value: string | number) => {
      if (type === 'showTime') {
        setQuizHeaderState({
          ...quizHeaderState,
          [type]: value,
        });
        return;
      }

      setQuizHeaderState({
        ...quizHeaderState,
        [type]: value,
      });
    },
    [quizHeaderState]
  );

  const timeFormat = useCallback(
    (val: string) => {
      if (val.length > 6) {
        val = val.substring(0, 6);
      }
      const hour = val.substring(0, 2) && val.substring(0, 2) !== '0' ? limit(val.substring(0, 2), '99') : '00';
      const minute = val.substring(2, 4) && val.substring(2, 4) !== '0' ? limit(val.substring(2, 4), '59') : '00';
      const second = val.substring(4, 6) && val.substring(4, 6) !== '0' ? limit(val.substring(4, 6), '59') : '00';

      // if (durationValue.current >= 3600) {
      return hour + ':' + minute + ':' + second;
      // } else {
      //   return hour + ':' + minute;
      // }
    },
    [durationValue.current]
  );

  const addZero = (numb: number) => {
    if (numb < 1) {
      return '00';
    } else {
      return (numb < 10 ? '0' : '') + `${Math.floor(numb)}`;
    }
  };

  const onChangeTime = () => {
    const hour = Math.floor(Number(quizHeaderState?.showTime) / 3600);
    const minute = (Math.floor(Number(quizHeaderState?.showTime)) % 3600) / 60;
    const second = Math.floor(Number(quizHeaderState?.showTime)) % 60;

    setTime(`${addZero(hour)}${addZero(minute)}${addZero(second)}`);
  };

  useEffect(() => {
    if (quizHeaderState?.showTime && time == '0') {
      onChangeTime();
    }
  }, [quizHeaderState?.showTime, time]);

  useEffect(() => {
    if (time === undefined) {
      return;
    }

    let ctime = 0;

    const hour = time.substring(0, 2) && time.substring(0, 2) !== '0' ? limit(time.substring(0, 2), '99') : '00';
    const minute = time.substring(2, 4) && time.substring(2, 4) !== '0' ? limit(time.substring(2, 4), '59') : '00';
    const second = time.substring(4, 6) && time.substring(4, 6) !== '0' ? limit(time.substring(4, 6), '59') : '00';

    ctime += hour !== '00' ? parseInt(hour) * 60 * 60 : 0;
    ctime += minute !== '00' ? parseInt(minute) * 60 : 0;
    ctime += second !== '00' ? parseInt(second) : 0;

    if (ctime) {
      if (ctime > mediaService?.mediaContents?.internalMedias[0]?.duration) {
        reactAlert({
          title: '안내',
          message: '노출시간을 확인하세요.',
          onClose: () => setTime('0000'),
        });
      }
      onChangeHeaderState('showTime', ctime);
    }
  }, [time]);

  const getTimeStringSeconds = useCallback(
    (seconds: number) => {
      let min: number | string = 0;
      let sec: number | string = 0;
      let hour: number | string = 0;

      hour = Math.floor(seconds / 3600);
      min = Math.floor((seconds % 3600) / 60);
      sec = Math.floor(seconds % 60);

      if (hour.toString().length == 1) hour = '0' + hour;
      if (min.toString().length == 1) min = '0' + min;
      if (sec.toString().length == 1) sec = '0' + sec;

      return hour + ':' + min + ':' + sec;
    },
    [durationValue.current]
  );

  return (
    <Table celled>
      <colgroup>
        <col width="85px" />
        <col width="auto" />
      </colgroup>
      <Table.Body>
        <Table.Row>
          <Table.Cell className="tb-header">제목</Table.Cell>
          <Table.Cell>
            <Form.Field
              control={Input}
              type="text"
              value={quizHeaderState?.name || ''}
              onChange={(e: any) => onChangeHeaderState('name', e.target.value)}
            />
          </Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell className="tb-header">노출시간</Table.Cell>
          <Table.Cell>
            <Form.Group style={{ display: 'flex', position: 'relative', width: '275px', textAlign: 'center' }}>
              <NumberFormat
                value={time || ''}
                onValueChange={(e: any) => {
                  setTime(e.value);
                }}
                placeholder="시:분:초"
                format={timeFormat}
                style={{ padding: '.67857143em 1em', height: '34px', borderRadius: '.28571429rem' }}
              />
              <span
                style={{
                  display: 'inline-block',
                  width: '100px',
                  height: '34px',
                  lineHeight: '34px',
                  paddingLeft: '.5em',
                }}
              >
                {durationValue.current > 0 ? `/  ${getTimeStringSeconds(durationValue.current)}` : `/ ${0}`}
              </span>
            </Form.Group>
          </Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table>
  );
};

export default React.memo(CreateQuizTableHeaderContainer);
