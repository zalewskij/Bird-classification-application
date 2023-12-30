import { Card, Typography } from 'antd';
import { useRecoilValue } from 'recoil';
import { polishVersionState } from '../atoms';

const { Paragraph, Link, Text } = Typography;

export default function About() {
  const isPolishVersion = useRecoilValue(polishVersionState);

  const polishCard = <Card title='O aplikacji'>
    <Paragraph>
      Niniejsza aplikacja do klasyfikacji ptaków została przygotowana w ramach pracy inżynierskiej przez <Text strong>Zofię Łągiewkę</Text>, <Text strong>Piotra Sieczkę</Text> i <Text strong>Jacka Zalewskiego</Text> na <Link href='https://ww2.mini.pw.edu.pl/'>Wydziale Matematyki i Nauk Informacyjnych</Link> <Link href='https://www.pw.edu.pl/'>Politechniki Warszawskiej</Link>, pod kierunkiem <Text strong><Link href='https://ajastrzebska.mini.pw.edu.pl/'>dr&nbsp;hab. Agnieszki Jastrzębskiej, prof. PW.</Link></Text>
    </Paragraph>
    <Paragraph>
      Dane użyte do trenowania modelu uczenia maszynowego pochodzą z bazy <Link href='https://xeno-canto.org/'>xeno-canto</Link>. Zdjęcia ptaków pochodzą z <Link href='https://commons.wikimedia.org/'>Wikimedia Commons</Link>.
    </Paragraph>
    <Paragraph>
      Aplikacja została stworzona przy użyciu <Link href='https://react.dev/'>React</Link> i <Link href='https://ant.design/'>Ant Design</Link>. Spektrogramy są generowane przy użyciu <Link href='https://wavesurfer.xyz/'>wavesurfer.js</Link>. Model uczenia maszynowego został stworzony przy użyciu bibliotek <Link href='https://pytorch.org/'>PyTorch</Link> i <Link href='https://librosa.org/'>Librosa</Link>.
    </Paragraph>
  </Card>;

  const englishCard = <Card title='About'>
    <Paragraph>
      This bird classification application was prepared as a part of the bachelor thesis by <Text strong>Zofia Łągiewka</Text>, <Text strong>Piotr Sieczka</Text> and <Text strong> Jacek Zalewski</Text> at <Link href='https://ww2.mini.pw.edu.pl/'>the Faculty of Mathematics and Information Science</Link> of <Link href='https://www.pw.edu.pl/'> Warsaw University of Technology</Link>, under the supervision of <Text strong><Link href='https://ajastrzebska.mini.pw.edu.pl/'>Agnieszka Jastrzębska, Ph.D., D.Sc.</Link></Text>
    </Paragraph>
    <Paragraph>
      The data used for training the machine learning model comes from the <Link href='https://xeno-canto.org/'>xeno-canto</Link> database. The birds' photos come from <Link href='https://commons.wikimedia.org/'>Wikimedia Commons</Link>.
    </Paragraph>
    <Paragraph>
      The application was created using <Link href='https://react.dev/'>React</Link> and <Link href='https://ant.design/'>Ant Design</Link>. Spectrograms are generated using <Link href='https://wavesurfer.xyz/'>wavesurfer.js</Link>. The machine learning model was created using <Link href='https://pytorch.org/'>PyTorch</Link> and <Link href='https://librosa.org/'>Librosa</Link>.
    </Paragraph>
  </Card>;

  return isPolishVersion ? polishCard : englishCard;
}